import React from "react";

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "64px",
        padding: "0 28px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e3e3e3",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Gemini 스타일의 그라데이션 타이틀 */}
        <span
          style={{
            fontSize: "33px",
            fontWeight: "800",
            fontFamily: '"Nunito", sans-serif',
            background:
              "linear-gradient(135deg, #4285f4 0%, #9b72cb 40%, #d96570 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          DARTIN
        </span>
        <span
          style={{
            fontSize: "13px",
            color: "#5f6368",
            paddingLeft: "12px",
            borderLeft: "1px solid #e3e3e3",
            fontWeight: "500",
          }}
        >
          AI Portal
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ fontSize: "14px", color: "#1f1f1f", fontWeight: "500" }}>
          <span style={{ color: "#5f6368" }}>로그인 계정:</span>{" "}
          <strong style={{ color: "#1f1f1f", fontWeight: "600" }}>
            {userName}
          </strong>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            borderRadius: "100px", // 알약 모양
            border: "1px solid #c7c7c7",
            backgroundColor: "#ffffff",
            color: "#1f1f1f",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f0f4f9";
            e.currentTarget.style.borderColor = "#a8a8a8";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#c7c7c7";
          }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;
