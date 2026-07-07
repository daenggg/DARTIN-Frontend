import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 레이아웃 & 공통 컴포넌트 임포트
import ChatHistorySidebar from "../components/chat/ChatHistorySidebar";
import ChatArea from "../components/chat/ChatArea";

// 기업 정보 & 탭 컴포넌트 임포트
import DashboardTab from "../components/company/tabs/DashboardTab";
import CompanyInfoTab from "../components/company/tabs/CompanyInfoTab";
import FinancialsTab from "../components/company/tabs/FinancialsTab";
import NewsTab from "../components/company/tabs/NewsTab";

import { fetchCompanyAnalysis } from "../services/companyApi";
import type {
  CompanyBasicInfo,
  FinancialInfoMap,
  NewsItem,
  JobLinks,
} from "../services/companyApi";
import axios from "axios";

interface Message {
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
  isStatus?: boolean;
  candidates?: Array<{ corp_name: string; corp_code: string }>;
  isLoginError?: boolean;
}

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("사용자");
  const [activeTab, setActiveTab] = useState<string>("대시보드");
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // UI 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string>("새 문서");
  const [leftWidth, setLeftWidth] = useState<number>(() =>
    Math.round(window.innerWidth * 0.35),
  ); // 기본 비율 3.5 : 6.5 (채팅 3.5 : 대시보드 6.5)
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // 실시간 수집 데이터 상태 관리
  const [analysisData, setAnalysisData] = useState<
    | {
        basicInfo?: CompanyBasicInfo;
        financialInfo?: FinancialInfoMap;
        news?: NewsItem[];
        aiAnalysis?: string;
        jobLinks?: JobLinks;
        sessionId?: string;
      }
    | undefined
  >(undefined);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.6; // 최대 화면의 60%까지
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // 채팅 상태 관리
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "안녕하세요. 분석을 원하시는 기업명을 입력해 주십시오.",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.nickname || "사용자");
      } catch (e) {
        console.error("사용자 정보 로딩 실패", e);
      }
    }
  }, []);

  // 새로고침 시 세션 유지 및 복원 처리
  useEffect(() => {
    const restoreSession = async () => {
      const storedSessionId = sessionStorage.getItem("currentSessionId");
      if (storedSessionId && storedSessionId !== "New") {
        const token = sessionStorage.getItem("accessToken");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
        try {
          const res = await axios.get(
            `${BACKEND_URL}/api/chat/sessions/${storedSessionId}`,
            {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            },
          );
          const detail = res.data;
          if (detail) {
            setAnalysisData({
              basicInfo: detail.company.basicInfo,
              financialInfo: detail.company.financialInfo,
              news: detail.company.news,
              aiAnalysis: detail.company.aiAnalysis,
              jobLinks: detail.company.jobLinks,
              sessionId: detail.sessionId || storedSessionId,
            });
            setSelectedCompany(detail.company.basicInfo.companyName);

            // 복원된 채팅 기록 매핑
            const mappedMsgs = detail.chat.messages.map((m: any) => ({
              sender: m.role === "user" ? "user" : "ai",
              text: m.content,
            }));
            setMessages(
              mappedMsgs.length > 0
                ? mappedMsgs
                : [
                    {
                      sender: "ai",
                      text: `"${detail.company.basicInfo.companyName}" 분석 대화가 복구되었습니다.`,
                    },
                  ],
            );
          }
        } catch (err: any) {
          console.error("Mount session restoration failed:", err);
          sessionStorage.removeItem("currentSessionId");
          if (err.response?.status === 401 || err.response?.status === 403) {
            sessionStorage.removeItem("accessToken");
            navigate("/login");
          }
        }
      }
    };

    restoreSession();
  }, []);

  const handleLogout = async () => {
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("currentSessionId");
      navigate("/");
    }
  };

  // 기업 후보 선택 후 데이터 로드 핸들러
  const handleSelectCandidate = async (corpCode: string, corpName: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `[선택] ${corpName}` },
    ]);
    setSelectedCompany(corpName);
    setAnalysisData(undefined); // 대기 상태로 전환

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `"${corpName}"의 실시간 데이터를 수집 및 분석하는 중입니다. 잠시만 기다려 주세요...`,
        isStreaming: true,
      },
    ]);

    try {
      const data = await fetchCompanyAnalysis(corpCode);

      // 상태 저장
      setAnalysisData({
        basicInfo: data.basicInfo,
        financialInfo: data.financialInfo,
        news: data.news,
        aiAnalysis: data.aiAnalysis,
        jobLinks: data.jobLinks,
        sessionId: data.session?.sessionId,
      });

      if (data.session?.sessionId) {
        sessionStorage.setItem("currentSessionId", data.session.sessionId);
      }

      setMessages((prev) => {
        const listWithoutLoading = prev.slice(0, -1);
        return [
          ...listWithoutLoading,
          {
            sender: "ai",
            text: `"${corpName}"에 대한 상세 실시간 분석이 완료되었습니다! 대시보드 및 각 상단 탭에서 상세 리포트를 확인해 보세요.`,
          },
        ];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const listWithoutLoading = prev.slice(0, -1);
        return [
          ...listWithoutLoading,
          {
            sender: "ai",
            text: "기업 분석 리포트를 생성하는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          },
        ];
      });
    }
  };

  // 1단계: 최초 기업명 검색 API 호출 공통 헬퍼 함수
  const executeCompanySearch = async (searchQuery: string) => {
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "입력하신 기업의 후보 목록을 검색하는 중입니다...",
        isStreaming: true,
      },
    ]);

    const fallbackSearchMessage = {
      sender: "ai" as const,
      text: `"${searchQuery}"에 해당되는 국내 상장 기업 후보를 찾지 못했습니다. 다른 기업을 다시 검색해 보세요.`,
    };

    try {
      const res = await axios.get(`${BACKEND_URL}/api/company/search`, {
        params: { search_query: searchQuery },
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const candidates = res.data?.companies;
      const isSingleMatch = res.data?.isSingleMatch;

      setMessages((prev) => {
        const listWithoutLoading = prev.slice(0, -1);

        // [isSingleMatch: true 분기] 단일 매칭 기업이고 후보군이 존재하면 대화창 선택지 렌더링을 패스하고 바로 대시보드 진입!
        if (isSingleMatch && Array.isArray(candidates) && candidates.length > 0) {
          const singleCompany = candidates[0];
          setTimeout(() => {
            handleSelectCandidate(singleCompany.corpCode, singleCompany.corpName);
          }, 0);
          return listWithoutLoading; // 분석 중 안내창이 뜰 것이므로 리스트 문구 추가 안 함
        }

        if (Array.isArray(candidates) && candidates.length > 0) {
          return [
            ...listWithoutLoading,
            {
              sender: "ai",
              text: `"${searchQuery}"에 대한 후보 기업 검색 결과입니다. 분석을 원하는 기업을 선택해 주세요:`,
              candidates: candidates.map((c: any) => ({
                corp_name: c.corpName,
                corp_code: c.corpCode,
              })),
            },
          ];
        } else {
          return [
            ...listWithoutLoading,
            fallbackSearchMessage,
          ];
        }
      });
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => {
        const listWithoutLoading = prev.slice(0, -1);
        const status = err.response?.status;
        const detail = err.response?.data?.detail;

        if (status === 401 || status === 403) {
          return [
            ...listWithoutLoading,
            {
              sender: "ai",
              text: "로그인 세션이 만료되었습니다. 다시 로그인한 후 이용해 주시기 바랍니다.",
              isLoginError: true,
            },
          ];
        }

        if (status === 400 || status === 404) {
          return [
            ...listWithoutLoading,
            fallbackSearchMessage,
          ];
        }

        return [
          ...listWithoutLoading,
          {
            sender: "ai",
            text: `후보 기업 검색 도중 에러가 발생했습니다: ${detail || "네트워크 통신 오류가 발생했습니다."}`,
          },
        ];
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    // 1. 이미 세션이 열린 상태에서의 후속 질문 (스트리밍 또는 재검색 판단)
    if (analysisData?.sessionId) {
      const token = sessionStorage.getItem("accessToken");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
      const sessionUrl = `${BACKEND_URL}/api/chat/sessions/${analysisData.sessionId}/messages`;

      try {
        const response = await fetch(sessionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ question: userMsg }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        // 백엔드가 스트림이 아닌 재검색용 일반 JSON을 응답했는지 응답 헤더 확인
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await response.json();
          // [예외 케이스 처리] 단일 매칭(isSingleMatch: true)으로 기업명이 응답된 경우
          if (json.isSingleMatch && Array.isArray(json.companyList) && json.companyList.length > 0) {
            const matchedCompany = json.companyList[0];
            // 1단계 최초 기업명 검색 GET API 자동 재호출
            setTimeout(() => {
              executeCompanySearch(matchedCompany);
            }, 0);
            return;
          }
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "답변을 준비하고 있습니다",
            isStreaming: true,
            isStatus: true,
          },
        ]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith("data:")) {
              const rawData = trimmed.substring(5).trim();
              try {
                const parsed = JSON.parse(rawData);
                const eventType = parsed.type;
                const eventData = parsed.data;

                if (eventType === "message") {
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.sender === "ai" && last.isStreaming) {
                      if (last.isStatus) {
                        return [
                          ...prev.slice(0, -1),
                          { ...last, text: eventData, isStatus: false },
                        ];
                      }
                      return [
                        ...prev.slice(0, -1),
                        { ...last, text: last.text + eventData },
                      ];
                    }
                    return prev;
                  });
                } else if (eventType === "status") {
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.sender === "ai" && last.isStreaming) {
                      return [
                        ...prev.slice(0, -1),
                        { ...last, text: eventData, isStatus: true },
                      ];
                    }
                    return prev;
                  });
                } else if (eventType === "done") {
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.sender === "ai" && last.isStreaming) {
                      return [
                        ...prev.slice(0, -1),
                        { ...last, isStreaming: false },
                      ];
                    }
                    return prev;
                  });
                }
              } catch (e) {
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.sender === "ai" && last.isStreaming) {
                    if (last.isStatus) {
                      return [
                        ...prev.slice(0, -1),
                        { ...last, text: rawData, isStatus: false },
                      ];
                    }
                    return [
                      ...prev.slice(0, -1),
                      { ...last, text: last.text + rawData },
                    ];
                  }
                  return prev;
                });
              }
            }
          }
        }

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.sender === "ai" && last.isStreaming) {
            return [...prev.slice(0, -1), { ...last, isStreaming: false }];
          }
          return prev;
        });
      } catch (err: any) {
        console.error(err);
        const status = err.response?.status;
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: status === 401 || status === 403
              ? "로그인 세션이 만료되었습니다. 다시 로그인한 후 이용해 주시기 바랍니다."
              : "대화 응답을 수신하는 데 실패했습니다.",
            isLoginError: status === 401 || status === 403,
          },
        ]);
      }
      return;
    }

    // 2. 세션이 없는 경우 최초 기업명 추출 후보 검색
    executeCompanySearch(userMsg);
  };

  const handleSelectHistory = async (
    sessionId: string,
    companyName: string,
  ) => {
    if (sessionId === "New") {
      setMessages([
        {
          sender: "ai",
          text: "안녕하세요. 분석을 원하시는 기업명을 입력해 주십시오.",
        },
      ]);
      setSelectedCompany("새 문서");
      setAnalysisData(undefined);
      sessionStorage.removeItem("currentSessionId");
    } else {
      setSelectedCompany(companyName);
      sessionStorage.setItem("currentSessionId", sessionId);

      const token = sessionStorage.getItem("accessToken");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/chat/sessions/${sessionId}`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          },
        );
        const detail = res.data;
        if (detail) {
          setAnalysisData({
            basicInfo: detail.company.basicInfo,
            financialInfo: detail.company.financialInfo,
            news: detail.company.news,
            aiAnalysis: detail.company.aiAnalysis,
            jobLinks: detail.company.jobLinks,
            sessionId: detail.sessionId || sessionId,
          });

          // 복원된 채팅 메시지 매핑 (role -> sender)
          const mappedMsgs = detail.chat.messages.map((m: any) => ({
            sender: m.role === "user" ? "user" : "ai",
            text: m.content,
          }));

          setMessages(
            mappedMsgs.length > 0
              ? mappedMsgs
              : [
                  {
                    sender: "ai",
                    text: `"${companyName}" 분석 대화가 복구되었습니다. 추가 질문을 하실 수 있습니다.`,
                  },
                ],
          );
        }
      } catch (err: any) {
        console.error("Failed to load session details:", err);
        const status = err.response?.status;
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: status === 401 || status === 403
              ? "로그인 세션이 만료되었습니다. 다시 로그인한 후 이용해 주시기 바랍니다."
              : "대화 상세 내용을 복구하는 도중 오류가 발생했습니다.",
            isLoginError: status === 401 || status === 403,
          },
        ]);
      }
    }
  };

  // 탭 목록 정의
  const tabs = [
    { id: "대시보드", label: "대시보드" },
    { id: "기업정보", label: "기업정보" },
    { id: "재무제표", label: "재무제표" },
    { id: "최신뉴스", label: "최신뉴스" },
  ];

  // 활성화 탭별 렌더링 매핑
  const renderTabContent = () => {
    switch (activeTab) {
      case "대시보드":
        return (
          <DashboardTab
            companyName={selectedCompany}
            analysisData={analysisData}
          />
        );
      case "기업정보":
        return <CompanyInfoTab analysisData={analysisData} />;
      case "재무제표":
        return (
          <FinancialsTab
            companyName={selectedCompany}
            analysisData={analysisData}
          />
        );
      case "최신뉴스":
        return <NewsTab analysisData={analysisData} />;
      default:
        return (
          <DashboardTab
            companyName={selectedCompany}
            analysisData={analysisData}
          />
        );
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex bg-[#fcfcfc] dark:bg-[#0b0c10] font-sans overflow-hidden box-border text-[#1a1a1a] dark:text-[#f4f4f5]">
      <ChatHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectHistory={handleSelectHistory}
        activeSessionId={analysisData?.sessionId}
      />

      <div
        className="flex flex-1 h-full overflow-hidden box-border"
        style={{ userSelect: isResizing ? "none" : "auto" }}
      >
        <div style={{ width: `${leftWidth}px` }} className="shrink-0 h-full">
          <ChatArea
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            companyName={selectedCompany}
            onSelectCandidate={handleSelectCandidate}
          />
        </div>

        {/* 클릭 앤 드래그 가능한 리사이즈 핸들러 선 */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-[5px] cursor-col-resize border-l border-solid border-l-[#e2e8f0] dark:border-l-zinc-800 transition-colors duration-150 h-full shrink-0 z-10 select-none ${
            isResizing ? "bg-blue-500" : "bg-transparent"
          }`}
        />

        <div className="flex-1 h-full flex flex-col bg-white dark:bg-[#121318] overflow-hidden box-border">
          <div className="flex items-center justify-between border-b border-solid border-[#e2e8f0] dark:border-zinc-800 px-6 h-11 bg-white dark:bg-[#121318] shrink-0">
            <div className="flex gap-6 h-full">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`bg-transparent border-none px-1 text-sm cursor-pointer h-full relative flex items-center transition-colors duration-150 ease-out ${
                      isActive
                        ? "font-semibold text-[#1a1a1a] dark:text-[#f4f4f5]"
                        : "font-normal text-[#71717a] dark:text-zinc-400 hover:text-[#1a1a1a] dark:hover:text-zinc-50"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] dark:bg-[#f4f4f5]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs text-[#71717a] dark:text-zinc-400">
              <span>{userName}님</span>
              <button
                onClick={handleLogout}
                className="border border-solid border-[#e2e8f0] dark:border-zinc-800 bg-transparent py-1 px-2.5 rounded text-xs text-[#71717a] dark:text-zinc-400 cursor-pointer transition-colors duration-150 hover:border-[#cbd5e1] dark:hover:border-zinc-600 hover:text-[#1a1a1a] dark:hover:text-zinc-50"
              >
                로그아웃
              </button>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="border border-solid border-[#e2e8f0] dark:border-zinc-800 bg-transparent p-1.5 rounded-lg cursor-pointer text-[#71717a] dark:text-zinc-400 hover:border-[#cbd5e1] dark:hover:border-zinc-600 hover:text-[#1a1a1a] dark:hover:text-zinc-50 flex items-center justify-center"
                title={theme === 'light' ? '다크모드 켜기' : '라이트모드 켜기'}
              >
                {theme === 'light' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                )}
              </button>
            </div>
          </div>

          <main className="flex-1 p-6 px-8 overflow-y-auto box-border custom-scrollbar">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
