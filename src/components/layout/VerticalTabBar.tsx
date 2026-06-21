import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface VerticalTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const VerticalTabBar: React.FC<VerticalTabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav
      style={{
        width: "55px",
        backgroundColor: "#e2e8f0", // 바인더 외곽 표지 가죽/종이 느낌의 백그라운드
        borderLeft: "1px solid #cbd5e1",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        paddingTop: "24px",
        gap: "10px",
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        
        // 탭별로 색인(Divider) 인덱스 색상을 부여하여 진짜 파일첩처럼 보이게 디자인
        const tabColors: { [key: string]: string } = {
          대시보드: "#4285f4",
          기업정보: "#16a34a",
          재무제표: "#3b82f6",
          최신뉴스: "#9b72cb",
          AI종합분석: "#d97706",
          자소서: "#ef4444",
          취업공고: "#0d9488"
        };
        
        const activeColor = tabColors[tab.id] || "#ff4d4f";

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="tab-button"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              padding: "18px 14px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              border: "1px solid #cbd5e1",
              borderLeft: isSelected ? "none" : "1px solid #cbd5e1",
              borderRadius: "0 10px 10px 0", // 바인더 파일 오른쪽 탭 색인 모양
              backgroundColor: isSelected ? "#ffffff" : "#f1f5f9",
              color: isSelected ? activeColor : "#5f6368",
              outline: "none",
              transform: isSelected ? "translateX(6px)" : "none", // 활성화 탭이 밖으로 더 튀어나옴
              boxShadow: isSelected ? "4px 2px 10px rgba(0,0,0,0.06)" : "none",
              zIndex: isSelected ? 2 : 1,
              transition: "all 0.2s ease-out",
              borderLeftColor: isSelected ? "transparent" : "#cbd5e1",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default VerticalTabBar;
