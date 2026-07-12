import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 레이아웃 & 공통 컴포넌트 임포트
import ChatHistorySidebar from "../components/chat/ChatHistorySidebar";
import ChatArea from "../components/chat/ChatArea";
import ConfirmModal from "../components/common/ConfirmModal";
import OnboardingModal from "../components/common/OnboardingModal";
import { useResizer } from "../hooks/useResizer";

// 기업 정보 & 탭 컴포넌트 임포트
import DashboardTab from "../components/company/tabs/DashboardTab";
import CompanyInfoTab from "../components/company/tabs/CompanyInfoTab";
import FinancialsTab from "../components/company/tabs/FinancialsTab";
import NewsTab from "../components/company/tabs/NewsTab";
import DashboardNavbar from "../components/company/DashboardNavbar";

import {
  fetchCompanyAnalysisStream,
  searchCompanies,
} from "../services/companyApi";
import { logout } from "../services/authApi";
import { fetchChatSessionDetail } from "../services/chatApi";
import {
  type CompanyBasicInfo,
  type FinancialInfoMap,
  type NewsItem,
  type JobLinks,
  type Message,
} from "../types/index";

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("사용자");
  const [activeTab, setActiveTab] = useState<string>("대시보드");
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light",
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
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [activeMobileView, setActiveMobileView] = useState<
    "chat" | "dashboard"
  >("chat");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 타 기업 감지 시 모달 상태 관리
  const [detectNewCompany, setDetectNewCompany] = useState<string | null>(null);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] =
    useState<boolean>(false);
  const { leftWidth, isResizing, handleMouseDown } = useResizer();

  // 온보딩 튜토리얼 상태 관리 (첫 방문 신규 가입 유저: isReturningUser가 "false"일 때만 노출)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return sessionStorage.getItem("isReturningUser") === "false";
  });

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // 한 번 온보딩을 완료/종료하면 세션스토리지 값을 true로 업데이트하여 재노출 방지
    sessionStorage.setItem("isReturningUser", "true");
  };

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
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "안녕하세요. 분석을 원하시는 기업명을 입력해 주십시오.",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleConfirmNewCompany = () => {
    if (!detectNewCompany) return;
    const newCorp = detectNewCompany;
    setIsNewCompanyModalOpen(false);
    setDetectNewCompany(null);

    // 새 대화 세션 상태로 리셋
    setMessages([
      {
        sender: "user",
        text: newCorp,
      },
    ]);
    setSelectedCompany("새 문서");
    setAnalysisData(undefined);
    sessionStorage.removeItem("currentSessionId");

    // 새로운 기업 후보군 검색 실행
    setTimeout(() => {
      executeCompanySearch(newCorp);
    }, 50);
  };

  const handleCancelNewCompany = () => {
    if (!detectNewCompany) return;
    const canceledCorp = detectNewCompany;
    setIsNewCompanyModalOpen(false);
    setDetectNewCompany(null);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `다른 기업(${canceledCorp})에 대한 질문이 감지되어 답변 생성이 취소되었습니다. 해당 기업 분석을 시작하려면 새 문서를 열고 진행해 주세요.`,
      },
    ]);
  };

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

  // 세션 상세 조회 및 복원 공통 헬퍼 함수
  const loadSessionDetails = async (
    sessionId: string,
    fallbackCompanyName: string,
  ) => {
    try {
      const detail = await fetchChatSessionDetail(sessionId);
      if (detail) {
        setAnalysisData({
          basicInfo: detail.company.basicInfo,
          financialInfo: detail.company.financialInfo,
          news: detail.company.news,
          aiAnalysis: detail.company.aiAnalysis,
          jobLinks: detail.company.jobLinks,
          sessionId: detail.sessionId || sessionId,
        });

        const resolvedCompanyName =
          detail.company?.basicInfo?.companyName || fallbackCompanyName;
        setSelectedCompany(resolvedCompanyName);
        sessionStorage.setItem("currentSessionId", sessionId);

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
                  text: `"${resolvedCompanyName}" 분석 대화가 복구되었습니다. 추가 질문을 하실 수 있습니다.`,
                },
              ],
        );
      }
    } catch (err: any) {
      console.error("세션 상세 데이터 로드 실패:", err);
      sessionStorage.removeItem("currentSessionId");
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        sessionStorage.removeItem("accessToken");
        navigate("/login");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "대화 상세 내용을 복구하는 도중 오류가 발생했습니다.",
          },
        ]);
      }
    }
  };

  // 새로고침 시 세션 유지 및 복원 처리
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("currentSessionId");
    if (storedSessionId && storedSessionId !== "New") {
      loadSessionDetails(storedSessionId, "이전 대화");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("currentSessionId");
      navigate("/");
    }
  };

  const handleSelectCandidate = async (
    corpCode: string,
    corpName: string,
    isAutoTrigger = false,
  ) => {
    if (!isAutoTrigger) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: `[선택] ${corpName}` },
      ]);
    }
    setSelectedCompany(corpName);
    setActiveMobileView("dashboard"); // 모바일 환경 대응: 기업 선택 시 대시보드 뷰로 자동 전환
    setAnalysisData({
      basicInfo: undefined,
      financialInfo: undefined,
      news: undefined,
      aiAnalysis: undefined,
      jobLinks: undefined,
      sessionId: undefined,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `"${corpName}"의 실시간 데이터를 수집 및 분석하는 중입니다. 잠시만 기다려 주세요...`,
        isStreaming: true,
        isStatus: true,
      },
    ]);

    try {
      await fetchCompanyAnalysisStream(corpCode, (type, data) => {
        if (type === "status") {
          setMessages((prev) => {
            const targetIdx = prev.findIndex(
              (m) => m.sender === "ai" && m.isStreaming && m.isStatus,
            );
            if (targetIdx !== -1) {
              const nextMsgs = [...prev];
              nextMsgs[targetIdx] = {
                ...nextMsgs[targetIdx],
                text: data,
              };
              return nextMsgs;
            }
            return prev;
          });
        } else if (type === "basicInfo") {
          setAnalysisData((prev) => ({ ...prev, basicInfo: data }));
        } else if (type === "financialInfo") {
          setAnalysisData((prev) => ({ ...prev, financialInfo: data }));
        } else if (type === "news") {
          setAnalysisData((prev) => ({ ...prev, news: data }));
        } else if (type === "aiAnalysis") {
          setAnalysisData((prev) => ({ ...prev, aiAnalysis: data }));
        } else if (type === "jobLinks") {
          setAnalysisData((prev) => ({ ...prev, jobLinks: data }));
        } else if (type === "done") {
          const sessionId = data?.sessionId;
          if (sessionId) {
            sessionStorage.setItem("currentSessionId", sessionId);
            setAnalysisData((prev) => ({ ...prev, sessionId }));
          }

          const completionText = `"${corpName}"에 대한 상세 실시간 분석이 완료되었습니다! 대시보드 및 각 상단 탭에서 상세 리포트를 확인해 보세요.`;
          let typedIndex = 0;

          // 기존 로딩(isStatus) 상태 해제 및 공백으로 셋업
          setMessages((prev) => {
            const targetIdx = prev.findIndex(
              (m) => m.sender === "ai" && m.isStreaming,
            );
            if (targetIdx !== -1) {
              const nextMsgs = [...prev];
              nextMsgs[targetIdx] = {
                sender: "ai",
                text: "",
                isStreaming: true,
                isStatus: false,
              };
              return nextMsgs;
            }
            return prev;
          });

          // 한 글자씩 타이핑하여 동적인 효과 연출 (2글자씩 15ms 마다 주르륵 출력)
          const typingTimer = setInterval(() => {
            typedIndex += 2;
            const portion = completionText.substring(0, typedIndex);

            setMessages((prev) => {
              const targetIdx = prev.findIndex(
                (m) => m.sender === "ai" && m.isStreaming,
              );
              if (targetIdx !== -1) {
                const nextMsgs = [...prev];
                nextMsgs[targetIdx] = {
                  ...nextMsgs[targetIdx],
                  text: portion,
                };
                return nextMsgs;
              }
              return prev;
            });

            if (typedIndex >= completionText.length) {
              clearInterval(typingTimer);
              setMessages((prev) => {
                const targetIdx = prev.findIndex(
                  (m) => m.sender === "ai" && m.isStreaming,
                );
                if (targetIdx !== -1) {
                  const nextMsgs = [...prev];
                  nextMsgs[targetIdx] = {
                    ...nextMsgs[targetIdx],
                    isStreaming: false,
                  };
                  return nextMsgs;
                }
                return prev;
              });
            }
          }, 15);
        }
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const targetIdx = prev.findIndex(
          (m) => m.sender === "ai" && m.isStreaming,
        );
        if (targetIdx !== -1) {
          const nextMsgs = [...prev];
          nextMsgs[targetIdx] = {
            sender: "ai",
            text: "기업 분석 리포트를 생성하는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
            isStreaming: false,
            isStatus: false,
          };
          return nextMsgs;
        }
        return [
          ...prev,
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
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "입력하신 기업의 후보 목록을 검색하는 중입니다...",
        isStreaming: true,
        isStatus: true,
      },
    ]);

    const fallbackSearchMessage = {
      sender: "ai" as const,
      text: `"${searchQuery}"에 해당되는 국내 상장 기업 후보를 찾지 못했습니다. 다른 기업을 다시 검색해 보세요.`,
    };

    try {
      const resData = await searchCompanies(searchQuery);

      const candidates = resData?.companies;
      const isSingleMatch = resData?.isSingleMatch;

      if (isSingleMatch && Array.isArray(candidates) && candidates.length > 0) {
        const singleCompany = candidates[0];
        setMessages((prev) => prev.slice(0, -1));
        handleSelectCandidate(
          singleCompany.corpCode,
          singleCompany.corpName,
          true,
        );
        return;
      }

      setMessages((prev) => {
        const listWithoutLoading = prev.slice(0, -1);

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
          return [...listWithoutLoading, fallbackSearchMessage];
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
          return [...listWithoutLoading, fallbackSearchMessage];
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

      let typingInterval: any = null;
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
          if (
            json.isSingleMatch &&
            Array.isArray(json.companyList) &&
            json.companyList.length > 0
          ) {
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
        let typingQueue = "";
        let isStreamingActive = true;

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "답변을 준비하고 있습니다",
            isStreaming: true,
            isStatus: true,
          },
        ]);

        // 타이핑 가속 주입 타이머 시작
        typingInterval = setInterval(() => {
          if (typingQueue.length > 0) {
            // 대기 중인 글자 수에 비례하여 타이핑 속도 조절 (동기 햅틱감 유지)
            const pullCount =
              typingQueue.length > 30 ? 5 : typingQueue.length > 10 ? 3 : 1;
            const chars = typingQueue.substring(0, pullCount);
            typingQueue = typingQueue.substring(pullCount);

            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === "ai" && last.isStreaming) {
                if (last.isStatus) {
                  return [
                    ...prev.slice(0, -1),
                    { ...last, text: chars, isStatus: false },
                  ];
                }
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + chars },
                ];
              }
              return prev;
            });
          } else if (!isStreamingActive) {
            clearInterval(typingInterval);
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === "ai" && last.isStreaming) {
                return [...prev.slice(0, -1), { ...last, isStreaming: false }];
              }
              return prev;
            });
          }
        }, 20);

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const dataIndex = line.indexOf("data:");
              if (dataIndex !== -1) {
                const leadText = line.substring(0, dataIndex).trim();
                if (leadText) {
                  typingQueue += "\n" + leadText;
                }

                const rawData = line.substring(dataIndex + 5).trim();
                try {
                  const parsed = JSON.parse(rawData);
                  const eventType = parsed.type;
                  const eventData = parsed.data;

                  if (eventType === "message") {
                    typingQueue += eventData;
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
                  } else if (eventType === "newCompany") {
                    const newCorpName = eventData?.companyName;
                    if (newCorpName) {
                      clearInterval(typingInterval);
                      setDetectNewCompany(newCorpName);
                      setIsNewCompanyModalOpen(true);
                      setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last && last.sender === "ai" && last.isStreaming) {
                          return prev.slice(0, -1);
                        }
                        return prev;
                      });
                    }
                  } else if (eventType === "done") {
                    isStreamingActive = false;
                  }
                } catch (e) {
                  typingQueue += rawData;
                }
              } else {
                const trimmed = line.trim();
                if (trimmed) {
                  typingQueue += "\n" + trimmed;
                }
              }
            }
          }
        } finally {
          isStreamingActive = false;
        }
      } catch (err: any) {
        console.error(err);
        const status = err.response?.status;
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              status === 401 || status === 403
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
      loadSessionDetails(sessionId, companyName);
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
            theme={theme}
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
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex font-sans overflow-hidden box-border"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <ChatHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectHistory={handleSelectHistory}
        activeSessionId={analysisData?.sessionId}
      />

      {isMobile ? (
        <div className="flex flex-col flex-1 h-full relative overflow-hidden box-border">
          {/* 모바일 뷰포트 영역 */}
          <div className="flex-1 w-full h-[calc(100%-48px)] overflow-hidden flex flex-col">
            {activeMobileView === "chat" ? (
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
            ) : (
              <div
                className="flex-1 w-full h-full flex flex-col overflow-hidden"
                style={{ background: "var(--bg-panel)" }}
              >
                <DashboardNavbar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  tabs={tabs}
                  userName={userName}
                  theme={theme}
                  setTheme={setTheme}
                  onLogout={handleLogout}
                  onStartTutorial={() => {
                    sessionStorage.setItem("isReturningUser", "false");
                    setShowOnboarding(true);
                  }}
                />
                <main className="flex-1 p-4 overflow-y-auto box-border custom-scrollbar">
                  {renderTabContent()}
                </main>
              </div>
            )}
          </div>

          {/* 모바일 하단 탭 바 */}
          <div
            className="h-12 border-t border-solid flex shrink-0 items-center justify-around select-none z-30"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-panel)",
            }}
          >
            <button
              onClick={() => setActiveMobileView("chat")}
              className="flex-1 h-full flex flex-col items-center justify-center bg-transparent border-none gap-0.5 cursor-pointer text-[10px] font-bold tracking-tight transition-colors duration-150"
              style={{
                color:
                  activeMobileView === "chat" ? "var(--accent)" : "var(--text)",
              }}
            >
              채팅
            </button>
            <button
              onClick={() => setActiveMobileView("dashboard")}
              className="flex-1 h-full flex flex-col items-center justify-center bg-transparent border-none gap-0.5 cursor-pointer text-[10px] font-bold tracking-tight transition-colors duration-150"
              style={{
                color:
                  activeMobileView === "dashboard"
                    ? "var(--accent)"
                    : "var(--text)",
              }}
            >
              분석 대시보드
            </button>
          </div>
        </div>
      ) : (
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
            className="w-[6px] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-col-resize h-full shrink-0 z-10 select-none flex items-center justify-center transition-colors duration-150"
          >
            <div
              className="w-[1px] h-full transition-colors duration-150"
              style={{
                backgroundColor: isResizing ? "var(--accent)" : "var(--border)",
              }}
            />
          </div>

          <div
            className="flex-1 h-full flex flex-col overflow-hidden box-border"
            style={{ background: "var(--bg-panel)" }}
          >
            <DashboardNavbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
              userName={userName}
              theme={theme}
              setTheme={setTheme}
              onLogout={handleLogout}
              onStartTutorial={() => {
                sessionStorage.setItem("isReturningUser", "false");
                setShowOnboarding(true);
              }}
            />

            <main className="flex-1 p-6 px-8 overflow-y-auto box-border custom-scrollbar">
              {renderTabContent()}
            </main>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isNewCompanyModalOpen}
        title="새 채팅을 시작할까요?"
        message={
          <>
            현재 선택되어 있는 기업은{" "}
            <strong className="font-bold text-[var(--text-h)]">
              [{selectedCompany}]
            </strong>
            입니다.
            <br />
            <br />
            새로운 기업인{" "}
            <strong className="font-bold text-[var(--text-h)]">
              [{detectNewCompany}]
            </strong>
            에 대한 분석을 시작하고 새 대화방을 여시겠습니까?
          </>
        }
        confirmText="새 대화 시작"
        cancelText="취소"
        onConfirm={handleConfirmNewCompany}
        onCancel={handleCancelNewCompany}
      />

      {/* 온보딩 가이드 팝업 모달 */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
};

export default Home;
