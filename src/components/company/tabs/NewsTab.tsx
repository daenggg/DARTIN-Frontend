import React from "react";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
}

interface NewsTabProps {
  analysisData?: {
    news?: NewsItem[];
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
      NEWS
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

const NewsTab: React.FC<NewsTabProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.news) {
    return <EmptyState />;
  }

  const categories = [
    { name: "속보", color: "#9b72cb", bgColor: "#f4f0fa" },
    { name: "기술/연구", color: "#4285f4", bgColor: "#f0f4f9" },
    { name: "공급망", color: "#4f46e5", bgColor: "#f0effd" },
    { name: "인사/채용", color: "#0d9488", bgColor: "#f0fdfa" },
  ];

  const newsList = analysisData.news.map((item, idx) => {
    const cat = categories[idx % categories.length];
    return {
      category: cat.name,
      color: cat.color,
      bgColor: cat.bgColor,
      press: `뉴스 • ${item.publishedAt}`,
      title: item.title,
      desc: item.summary,
      url: item.url,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#18181b", textAlign: "left" }}>
          실시간 기업 관련 뉴스 피드
        </h3>
      </div>

      {newsList.map((news, idx) => (
        <div
          key={idx}
          onClick={() => window.open(news.url, "_blank")}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "20px 24px",
            border: "1px solid #e4e4e7",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#a1a1aa")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#e2e8f0",
              backgroundImage: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          >
            📰
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: news.color,
                  backgroundColor: news.bgColor,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                {news.category}
              </span>
              <span style={{ fontSize: "12px", color: "#71717a" }}>{news.press}</span>
            </div>
            <h4
              style={{
                margin: "0 0 6px 0",
                fontSize: "14px",
                fontWeight: "700",
                color: "#18181b",
                lineHeight: "1.4",
                textAlign: "left",
              }}
            >
              {news.title}
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.6", textAlign: "left" }}>
              {news.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsTab;
