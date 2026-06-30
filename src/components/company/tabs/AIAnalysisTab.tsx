import React from "react";
import { MarkdownRenderer } from "../../common/MarkdownRenderer";

interface AIAnalysisTabProps {
  analysisData?: {
    aiAnalysis?: string;
  };
}

const EmptyState: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "120px 24px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.01), 0 10px 30px rgba(0,0,0,0.02)",
      color: "#475569",
      textAlign: "center",
      gap: "24px",
      fontFamily: "'Inter', sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}
  >
    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: "var(--fs-xs)",
        fontWeight: "600",
        letterSpacing: "1px"
      }}
    >
      REPORT
    </div>
    
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "var(--fs-lg)", letterSpacing: "-0.01em" }}>
        데이터 분석 세션 대기 중
      </div>
      <div style={{ fontSize: "var(--fs-sm)", lineHeight: "1.6", color: "#64748b", maxWidth: "360px" }}>
        실시간 기업 공시 정보(DART), 재무 실적 추이 및 미디어 정보 추출을 시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
      </div>
    </div>
  </div>
);

const AIAnalysisTab: React.FC<AIAnalysisTabProps> = ({ analysisData }) => {
  const aiAnalysis = analysisData?.aiAnalysis;

  if (!aiAnalysis) {
    return <EmptyState />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "28px",
          border: "1px solid #e3e3e3",
          lineHeight: "1.7",
          fontSize: "var(--fs-lg)",
          color: "#334155",
          textAlign: "left"
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: "var(--fs-xl)", fontWeight: 700, color: "#1f1f1f" }}>
          ✦ AI 종합 분석 리포트
        </h3>
        <MarkdownRenderer content={aiAnalysis} />
      </div>
    </div>
  );
};

export default AIAnalysisTab;
