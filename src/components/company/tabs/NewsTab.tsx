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
    className="flex flex-col items-center justify-center py-[120px] px-6 rounded-xl border border-solid text-center gap-6 font-sans w-full box-border"
    style={{
      background: "var(--bg-panel)",
      borderColor: "var(--border)",
      color: "var(--text)",
    }}
  >
    <div
      className="text-xs font-bold uppercase tracking-wider"
      style={{ color: "var(--text)" }}
    >
      NO NEWS DATA
    </div>

    <div className="flex flex-col gap-2">
      <div
        className="font-semibold text-lg tracking-tight"
        style={{ color: "var(--text-h)" }}
      >
        데이터 분석 세션 대기 중
      </div>
      <div
        className="text-sm leading-relaxed max-w-[360px] mx-auto"
        style={{ color: "var(--text)" }}
      >
        실시간 기업 공시 정보, 재무 실적 추이 및 미디어 정보 추출을 시작하려면
        좌측 대화창에 분석 대상을 입력해 주십시오.
      </div>
    </div>
  </div>
);

const NewsTab: React.FC<NewsTabProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.news) {
    return <EmptyState />;
  }

  const categories = [
    { name: "속보" },
    { name: "기술/연구" },
    { name: "공급망" },
    { name: "인사/채용" },
  ];

  const newsList = analysisData.news.map((item, idx) => {
    const cat = categories[idx % categories.length];
    return {
      category: cat.name,
      press: `${item.publishedAt.split("T")[0]}`,
      title: item.title,
      desc: item.summary,
      url: item.url,
    };
  });

  return (
    <div
      className="border border-solid rounded-2xl overflow-hidden w-full box-border text-left flex flex-col font-sans"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-panel)",
        color: "var(--text)",
      }}
    >
      {/* 타이틀 헤더 바 */}
      <div
        className="p-2.5 px-5 border-b border-solid flex items-center justify-between shrink-0"
        style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
      >
        <span
          className="text-xs md:text-sm font-extrabold uppercase tracking-wider"
          style={{ color: "var(--text-h)" }}
        >
          MEDIA REPORT / 관련 언론사 뉴스 리포트
        </span>
      </div>

      {/* 뉴스 목록 리스트 */}
      <div className="flex flex-col w-full">
        {newsList.map((news, idx) => (
          <div
            key={idx}
            onClick={() => window.open(news.url, "_blank")}
            className="p-6 border-b border-solid last:border-none flex flex-col items-start cursor-pointer transition-colors duration-150 box-border text-left group"
            style={{
              borderBottomColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-2.5 text-xs">
              <span
                className="text-[9px] font-bold py-0.5 px-2.5 rounded-full border border-solid tracking-wider"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  background: "var(--bg)",
                }}
              >
                {news.category}
              </span>
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                {news.press}
              </span>
            </div>

            <div className="flex w-full justify-between items-start gap-4 mb-2">
              <h4
                className="m-0 text-md font-bold leading-snug group-hover:text-[var(--accent)] group-hover:underline transition-all duration-150"
                style={{ color: "var(--text-h)" }}
              >
                {news.title}
              </h4>
              <svg
                className="shrink-0 text-zinc-400 group-hover:text-[var(--accent)] transition-colors duration-150 mt-1"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>

            <p
              className="m-0 text-xs leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {news.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTab;
