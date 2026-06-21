import React from "react";

interface CompanyHeaderProps {
  companyName: string;
  description: string;
  onLogoClick?: () => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyName,
  description,
  onLogoClick,
}) => {
  const isSamsung = companyName.includes("삼성");

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px", // 더 둥근 모서리
        padding: "24px 28px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)",
        border: "1px solid #e3e3e3",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Outfit', 'Inter', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* 기업 브랜드 로고 */}
        <div
          onClick={onLogoClick}
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "16px",
            border: "1px solid #f0f4f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "#f0f4f9",
            padding: "4px",
            boxSizing: "border-box",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
        >
          {isSamsung ? (
            <div
              style={{
                width: "44px",
                height: "24px",
                backgroundColor: "#0a58ca",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "7px",
                fontWeight: "900",
              }}
            >
              SAMSUNG
            </div>
          ) : (
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e11d48" }}>
              SK
            </div>
          )}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1f1f1f" }}>
            {companyName}
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#5f6368" }}>
            {description}
          </p>
        </div>
      </div>

      {/* 채용 링크 (Gemini 캡슐 스타일 아웃라인 버튼) */}
      <div style={{ display: "flex", gap: "10px" }}>
        {["사람인 공고 🔗", "잡코리아 공고 🔗", "원티드 공고 🔗"].map((text, idx) => (
          <button
            key={idx}
            onClick={() =>
              window.open(
                idx === 0
                  ? `https://www.saramin.co.kr/zf_user/search?searchword=${companyName}`
                  : idx === 1
                  ? `https://www.jobkorea.co.kr/Search/?stext=${companyName}`
                  : `https://www.wanted.co.kr/search?query=${companyName}`,
                "_blank"
              )
            }
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "100px", // 완전히 둥근 알약형
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#3c4043",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f4f9";
              e.currentTarget.style.borderColor = "#a8a8a8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanyHeader;
