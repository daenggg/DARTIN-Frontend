import React from "react";

interface DashboardTabProps {
  companyName: string;
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
    financialInfo?: Record<
      string,
      {
        revenue: number;
        operatingProfit: number;
        debtRatio: number;
      }
    >;
    news?: Array<{
      title: string;
      summary: string;
      url: string;
      publishedAt: string;
    }>;
    aiAnalysis?: string;
    jobLinks?: {
      saramin: string;
      wanted: string;
      work24: string;
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
        fontSize: "var(--fs-xs)",
        fontWeight: "600",
        letterSpacing: "1px"
      }}
    >
      ANALYSIS
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

const formatMoney = (val: number): string => {
  if (val >= 1e12) {
    return `${(val / 1e12).toFixed(1)}조원`;
  }
  return `${Math.round(val / 1e8).toLocaleString()}억원`;
};

const DashboardTab: React.FC<DashboardTabProps> = ({ companyName, analysisData }) => {
  if (!analysisData || !analysisData.basicInfo) {
    return <EmptyState />;
  }

  const basic = analysisData.basicInfo;
  const fin = analysisData.financialInfo || {};
  const sortedYears = Object.keys(fin).sort();
  const latestYear = sortedYears[sortedYears.length - 1];

  const revenueStr = latestYear 
    ? formatMoney(fin[latestYear].revenue)
    : "-조원";
  const opProfitStr = latestYear
    ? formatMoney(fin[latestYear].operatingProfit)
    : "-조원";

  const mappedNews = (analysisData.news || []).map((item) => ({
    press: "뉴스",
    title: item.title,
    desc: item.summary,
    time: item.publishedAt.split("T")[0],
    url: item.url,
  }));

  const aiFeedbackText = analysisData.aiAnalysis
    ? analysisData.aiAnalysis.slice(0, 300) + (analysisData.aiAnalysis.length > 300 ? "..." : "")
    : "실시간 분석 진행 완료. 분석 탭에서 마크다운 리포트를 확인하실 수 있습니다.";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* 상단 2분할 레이아웃 */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", width: "100%" }}>
        {/* 좌측 영역 */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 기업 정보 카드 */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              padding: "24px",
              border: "1px solid #e4e4e7",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              flex: 1,
              boxSizing: "border-box",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "6px",
                    border: "1px solid #e4e4e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f3ff",
                    fontWeight: "bold",
                  }}
                >
                  <div style={{ color: "#4f46e5", fontSize: "var(--fs-xs)" }}>
                    {basic.isListed ? basic.stockMarket || "KOSPI" : "CORP"}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "700", color: "#18181b" }}>
                    {basic.companyName}
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "var(--fs-sm)", color: "#71717a" }}>
                    {basic.industry || "정보 없음"}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "16px", fontSize: "var(--fs-sm)", color: "#4b5563", display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                <div><strong>대표이사:</strong> {basic.ceo}</div>
                <div><strong>본사 주소:</strong> {basic.address}</div>
                <div><strong>설립연도:</strong> {basic.establishedYear}년</div>
                <div><strong>임직원 수:</strong> {basic.employeeCount ? `${basic.employeeCount.toLocaleString()}명` : "정보 없음"}</div>
              </div>
            </div>

            {analysisData.jobLinks && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                <button
                  onClick={() => window.open(analysisData.jobLinks!.saramin, "_blank")}
                  style={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "var(--fs-xs)",
                    fontWeight: "500",
                    color: "#18181b",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  사람인 공고
                </button>
                <button
                  onClick={() => window.open(analysisData.jobLinks!.wanted, "_blank")}
                  style={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "var(--fs-xs)",
                    fontWeight: "500",
                    color: "#18181b",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  원티드 공고
                </button>
                <button
                  onClick={() => window.open(analysisData.jobLinks!.work24, "_blank")}
                  style={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "var(--fs-xs)",
                    fontWeight: "500",
                    color: "#18181b",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  워크24 공고
                </button>
              </div>
            )}
          </div>

          {/* 재무제표 요약 카드 */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              padding: "24px",
              border: "1px solid #e4e4e7",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flex: 1,
              boxSizing: "border-box",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "700", color: "#18181b", textAlign: "left" }}>
              최근 실적 요약 ({latestYear ? `${latestYear}년` : ""})
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", flex: 1, alignItems: "center" }}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f4f4f5",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: "var(--fs-xs)", color: "#71717a" }}>매출액</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "var(--fs-xl)", fontWeight: "700", color: "#18181b" }}>
                  {revenueStr}
                </p>
              </div>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f4f4f5",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: "var(--fs-xs)", color: "#71717a" }}>영업이익</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "var(--fs-xl)", fontWeight: "700", color: "#4f46e5" }}>
                  {opProfitStr}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 영역 - 최신 뉴스 */}
        <div
          style={{
            flex: "1.2 1 320px",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "24px",
            border: "1px solid #e4e4e7",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "700", color: "#18181b", textAlign: "left" }}>
            최신 관련 뉴스
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, justifyContent: "space-between" }}>
            {mappedNews.length === 0 ? (
              <div style={{ fontSize: "var(--fs-sm)", color: "#71717a", padding: "24px 0", textAlign: "center" }}>수집된 뉴스가 없습니다.</div>
            ) : (
              mappedNews.slice(0, 3).map((news, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(news.url, "_blank")}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "12px",
                    backgroundColor: "#f4f4f5",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    flex: 1,
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: "#e2e8f0",
                      backgroundImage: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--fs-lg)",
                      flexShrink: 0,
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  >
                    📰
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
                    <span style={{ fontSize: "var(--fs-xs)", color: "#71717a", marginBottom: "4px" }}>
                      {news.press} • {news.time}
                    </span>
                    <h5
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "var(--fs-sm)",
                        fontWeight: "700",
                        color: "#1a73e8",
                        lineHeight: "1.4",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {news.title}
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "var(--fs-xs)",
                        color: "#71717a",
                        lineHeight: "1.5",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {news.desc}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 하단 영역: AI 종합 분석 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          padding: "24px",
          border: "1px solid #e4e4e7",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h4 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "700", color: "#18181b", textAlign: "left" }}>
          AI 종합 분석 피드백
        </h4>

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "var(--fs-sm)", color: "#18181b", fontWeight: "700", flexShrink: 0 }}>
            ✦
          </span>
          <span style={{ fontSize: "var(--fs-sm)", color: "#71717a", lineHeight: "1.5", whiteSpace: "pre-wrap", textAlign: "left" }}>
            {aiFeedbackText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
