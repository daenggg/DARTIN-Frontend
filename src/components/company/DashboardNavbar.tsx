import React from "react";

interface DashboardNavbarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: Array<{ id: string; label: string }>;
  userName: string;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onLogout: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  userName,
  theme,
  setTheme,
  onLogout,
}) => {
  return (
    <div
      className="flex items-center justify-between border-b border-solid px-3 md:px-6 h-12 md:h-11 shrink-0 gap-2 overflow-hidden"
      style={{ borderBottomColor: "var(--border)", background: "var(--bg-panel)" }}
    >
      <div className="flex gap-3 md:gap-6 h-full overflow-x-auto whitespace-nowrap scrollbar-none">
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
        className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs shrink-0"
        style={{ color: "var(--text)" }}
      >
        <span className="hidden sm:inline">{userName}님</span>
        <button
          onClick={onLogout}
          className="border border-solid bg-transparent py-1 px-2 rounded text-[10px] md:text-xs cursor-pointer transition-colors duration-150 font-semibold"
          style={{
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          로그아웃
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="border border-solid bg-transparent p-1.5 rounded-lg cursor-pointer flex items-center justify-center"
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
      </div>
    </div>
  );
};

export default DashboardNavbar;
