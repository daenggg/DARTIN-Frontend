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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white rounded-xl border border-solid border-[#f1f5f9] shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_30px_rgba(0,0,0,0.02)] text-[#475569] text-center gap-6 font-sans w-full box-border">
    <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-solid border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-xs font-semibold tracking-wider">
      NEWS
    </div>
    
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-[#0f172a] text-lg tracking-tight">
        데이터 분석 세션 대기 중
      </div>
      <div className="text-sm leading-relaxed text-[#64748b] max-w-[360px] mx-auto">
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
    <div className="flex flex-col gap-4 font-sans">
      <div className="flex justify-between items-center mb-1">
        <h3 className="m-0 text-lg font-bold text-[#18181b] text-left">
          관련 언론사 뉴스 리포트
        </h3>
      </div>

      {newsList.map((news, idx) => (
        <div
          key={idx}
          onClick={() => window.open(news.url, "_blank")}
          className="bg-white rounded-lg p-5 border border-solid border-[#e4e4e7] flex gap-5 items-center cursor-pointer transition-colors duration-150 hover:border-[#a1a1aa]"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#e2e8f0] to-[#cbd5e1] rounded-md flex items-center justify-center text-3xl shrink-0 border border-solid border-[#cbd5e1] box-border">
            📰
          </div>

          <div className="flex-1 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-2">
              <span
                style={{ color: news.color, backgroundColor: news.bgColor }}
                className="text-xs font-bold py-1 px-2 rounded"
              >
                {news.category}
              </span>
              <span className="text-sm text-[#71717a]">{news.press}</span>
            </div>
            <h4 className="m-0 mb-1.5 text-lg font-bold text-[#18181b] leading-snug text-left">
              {news.title}
            </h4>
            <p className="m-0 text-sm text-[#71717a] leading-relaxed text-left">
              {news.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsTab;
