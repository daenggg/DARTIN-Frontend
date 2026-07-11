import React, { useState } from "react";

interface DashboardNavbarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: Array<{ id: string; label: string }>;
  userName: string;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onLogout: () => void;
  onStartTutorial: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  userName,
  theme,
  setTheme,
  onLogout,
  onStartTutorial,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div
      className="flex items-center justify-between border-b border-solid px-3 md:px-6 h-12 md:h-11 shrink-0 gap-2"
      style={{ borderBottomColor: "var(--border)", background: "var(--bg-panel)" }}
    >
      <div 
        id="onboarding-dashboard-nav"
        className="flex gap-3 md:gap-6 h-full overflow-x-auto whitespace-nowrap scrollbar-none"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="bg-transparent border-none px-1 text-xs md:text-sm cursor-pointer h-full relative flex items-center transition-colors duration-150 ease-out shrink-0"
              style={{
                color: isActive ? "var(--text-h)" : "var(--text)",
                fontWeight: isActive ? "600" : "400",
              }}
            >
              {tab.label}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: "var(--text-h)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className="flex items-center gap-2 md:gap-3.5 text-[10px] md:text-xs shrink-0 relative"
        style={{ color: "var(--text)" }}
      >
        {/* 사용자 정보 클릭 버튼 (토글 버튼들과 동일한 외곽선 테두리 및 30px 높이 디자인으로 통합) */}
        <div className="relative flex items-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="border border-solid bg-transparent px-3 rounded-lg cursor-pointer flex items-center justify-center font-bold text-[10px] md:text-xs select-none hover:bg-[var(--bg-hover)] h-[30px] box-border"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-h)",
            }}
          >
            {userName}님
          </button>

          {/* 로그아웃 드롭다운 */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div 
                className="absolute right-0 top-full mt-1.5 w-20 rounded-lg border border-solid shadow-lg z-50 p-1 flex flex-col font-sans"
                style={{ 
                  background: "var(--bg-panel)", 
                  borderColor: "var(--border)" 
                }}
              >
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-center bg-transparent border-none py-1.5 px-2 text-[9px] md:text-[10px] font-bold rounded cursor-pointer transition-all hover:bg-[var(--bg-hover)]"
                  style={{ color: "var(--accent)" }}
                >
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>

        {/* 설정 버튼 그룹 (다크모드 -> 물음표 튜토리얼 순서 및 gap 단축) */}
        <div className="flex items-center gap-1">
          {/* 다크모드 토글 버튼 (30px 정사각형으로 통일) */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="border border-solid bg-transparent rounded-lg cursor-pointer flex items-center justify-center hover:bg-[var(--bg-hover)] h-[30px] w-[30px] box-border"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            title={theme === "light" ? "다크모드 켜기" : "라이트모드 켜기"}
          >
            {theme === "light" ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* 서비스 가이드 다시 보기 버튼 (30px 정사각형으로 통일) */}
          <button
            onClick={onStartTutorial}
            className="border border-solid bg-transparent rounded-lg cursor-pointer flex items-center justify-center hover:bg-[var(--bg-hover)] h-[30px] w-[30px] box-border"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            title="서비스 가이드 다시 보기"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
