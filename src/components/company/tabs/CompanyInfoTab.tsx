import React from "react";

interface CompanyInfoTabProps {
  analysisData?: {
    basicInfo?: {
      companyName: string;
      ceo: string;
      address: string;
      industry?: string | null;
      isListed: boolean;
      stockMarket?: string | null;
      establishedYear: string;
      employeeCount?: number | null;
    };
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
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "1px"
      }}
    >
      PROFILE
    </div>
    
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "15px", letterSpacing: "-0.01em" }}>
        데이터 분석 세션 대기 중
      </div>
      <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#64748b", maxWidth: "360px" }}>
        실시간 기업 공시 정보(DART), 재무 실적 추이 및 미디어 정보 추출을 시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
      </div>
    </div>
  </div>
);

const CompanyInfoTab: React.FC<CompanyInfoTabProps> = ({ analysisData }) => {
  const basicInfo = analysisData?.basicInfo;

  if (!basicInfo) {
    return <EmptyState />;
  }

  const infoItems = [
    { label: "CEO (대표이사)", value: basicInfo.ceo },
    { label: "설립일", value: `${basicInfo.establishedYear}년` },
    { label: "직원 수 (임직원)", value: basicInfo.employeeCount ? `${basicInfo.employeeCount.toLocaleString()}명` : "-" },
    { label: "본사 소재지", value: basicInfo.address },
    { label: "주요 사업", value: basicInfo.industry || "기타 제조/서비스업" },
    { label: "상장 여부", value: basicInfo.isListed ? `${basicInfo.stockMarket || "KOSPI"} 상장` : "비상장" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* 상세 개요 카드 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #e4e4e7",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: "15px", fontWeight: 700, color: "#18181b", textAlign: "left" }}>
          기업 기본 정보
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {infoItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                borderBottom: "1px solid #f4f4f5",
                paddingBottom: "12px",
                fontSize: "13px",
              }}
            >
              <span style={{ width: "140px", color: "#71717a", fontWeight: "500", textAlign: "left" }}>{item.label}</span>
              <span style={{ color: "#18181b", fontWeight: "600", textAlign: "left" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 비전 및 핵심 가치 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #e4e4e7",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: "15px", fontWeight: 700, color: "#18181b", textAlign: "left" }}>
          핵심 기업 비전
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            {
              title: "We Do Technology",
              desc: "첨단 기술력을 바탕으로 새로운 사회 가치를 창출하고, 인류 문명의 더 나은 지속가능성을 선도합니다.",
            },
            {
              title: "Global Leader",
              desc: "독보적인 전문성을 개발하여 글로벌 지식경제 및 다가올 인공지능 시대를 가속화합니다.",
            },
            {
              title: "Eco-Friendly ESG",
              desc: "투명하고 친환경적인 경영 체계를 확립하여 장기적인 사회 공헌 가치를 개척합니다.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#f4f4f5",
                padding: "20px",
                borderRadius: "6px",
                border: "1px solid #e4e4e7",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "700", color: "#18181b", textAlign: "left" }}>
                {card.title}
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.6", textAlign: "left" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTab;
