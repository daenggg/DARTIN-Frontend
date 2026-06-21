import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 레이아웃 & 공통 컴포넌트 임포트
import ChatHistorySidebar from "../components/chat/ChatHistorySidebar";
import ChatArea from "../components/chat/ChatArea";

// 기업 정보 & 탭 컴포넌트 임포트
import DashboardTab from "../components/company/tabs/DashboardTab";
import CompanyInfoTab from "../components/company/tabs/CompanyInfoTab";
import FinancialsTab from "../components/company/tabs/FinancialsTab";
import NewsTab from "../components/company/tabs/NewsTab";
import AIAnalysisTab from "../components/company/tabs/AIAnalysisTab";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("사용자");
  const [activeTab, setActiveTab] = useState<string>("대시보드");
  
  // UI 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string>("SK하이닉스");
  const [leftWidth, setLeftWidth] = useState<number>(420); // 기본값 420px
  const [isResizing, setIsResizing] = useState<boolean>(false);

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
      text: "안녕하세요. 분석을 원하시는 기업명을 입력해 주십시오."
    },
    {
      sender: "user",
      text: "SK하이닉스 분석자료 조회해줘"
    },
    {
      sender: "ai",
      text: "SK하이닉스 분석 데이터를 구성했습니다. 상단 탭을 통해 분야별 정밀 리포트를 확인하실 수 있습니다."
    }
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

  const handleLogout = async () => {
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    setTimeout(() => {
      setSelectedCompany(userMsg);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `"${userMsg}" 보고서가 갱신되었습니다. 상단 탭에서 상세 내용을 확인하십시오.`
        }
      ]);
    }, 400);
  };

  const handleSelectHistory = (company: string) => {
    if (company === "New") {
      setMessages([
        {
          sender: "ai",
          text: "기업명을 입력하시면 정밀 데이터 수집 및 분석을 시작합니다."
        }
      ]);
      setSelectedCompany("새 문서");
    } else {
      setSelectedCompany(company);
      setMessages([
        {
          sender: "ai",
          text: `이전 조회 기록에서 "${company}" 리포트를 복원했습니다.`
        }
      ]);
    }
  };

  // 탭 목록 정의
  const tabs = [
    { id: "대시보드", label: "대시보드" },
    { id: "기업정보", label: "기업정보" },
    { id: "재무제표", label: "재무제표" },
    { id: "최신뉴스", label: "최신뉴스" },
    { id: "AI종합분석", label: "AI종합분석" }
  ];

  // 활성화 탭별 렌더링 매핑
  const renderTabContent = () => {
    switch (activeTab) {
      case "대시보드":
        return <DashboardTab companyName={selectedCompany} />;
      case "기업정보":
        return <CompanyInfoTab />;
      case "재무제표":
        return <FinancialsTab />;
      case "최신뉴스":
        return <NewsTab />;
      case "AI종합분석":
        return <AIAnalysisTab />;
      default:
        return <DashboardTab companyName={selectedCompany} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fcfcfc",
        fontFamily: "'Inter', sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        boxSizing: "border-box",
        color: "#1a1a1a"
      }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      <ChatHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectHistory={handleSelectHistory}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          height: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          userSelect: isResizing ? "none" : "auto",
        }}
      >
        <div style={{ width: `${leftWidth}px`, flexShrink: 0, height: "100%" }}>
          <ChatArea
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            companyName={selectedCompany}
          />
        </div>

        {/* 클릭 앤 드래그 가능한 리사이즈 핸들러 선 */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "5px",
            cursor: "col-resize",
            backgroundColor: isResizing ? "#3b82f6" : "transparent",
            borderLeft: "1px solid #e2e8f0",
            transition: "background-color 0.15s ease",
            height: "100%",
            flexShrink: 0,
            zIndex: 10,
            userSelect: "none",
          }}
        />

        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e2e8f0",
              padding: "0 24px",
              height: "56px",
              backgroundColor: "#ffffff",
              flexShrink: 0
            }}
          >
            <div style={{ display: "flex", gap: "24px", height: "100%" }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      border: "none",
                      background: "none",
                      padding: "0 4px",
                      fontSize: "13px",
                      fontWeight: isActive ? "600" : "400",
                      color: isActive ? "#1a1a1a" : "#71717a",
                      cursor: "pointer",
                      height: "100%",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s ease-out"
                    }}
                  >
                    {tab.label}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          backgroundColor: "#1a1a1a"
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "#71717a" }}>
              <span>{userName}님</span>
              <button
                onClick={handleLogout}
                style={{
                  border: "1px solid #e2e8f0",
                  backgroundColor: "transparent",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: "#71717a",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#1a1a1a";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#71717a";
                }}
              >
                로그아웃
              </button>
            </div>
          </div>

          <main
            style={{
              flex: 1,
              padding: "24px 32px",
              overflowY: "auto",
              boxSizing: "border-box"
            }}
            className="custom-scrollbar"
          >
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
