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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white dark:bg-[#121318] rounded-xl border border-solid border-[#f1f5f9] dark:border-zinc-800 text-[#475569] dark:text-zinc-400 text-center gap-6 font-sans w-full box-border">
    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
      NO NEWS DATA
    </div>
    
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-[#0f172a] dark:text-zinc-200 text-lg tracking-tight">
        데이터 분석 세션 대기 중
      </div>
      <div className="text-sm leading-relaxed text-[#64748b] dark:text-zinc-400 max-w-[360px] mx-auto">
        실시간 기업 공시 정보, 재무 실적 추이 및 미디어 정보 추출을 시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
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
      press: `뉴스 • ${item.publishedAt.split("T")[0]}`,
      title: item.title,
      desc: item.summary,
      url: item.url,
    };
  });

  return (
    <div className="border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#121318] w-full box-border text-[#18181b] dark:text-[#f4f4f5] text-left flex flex-col font-sans">
      
      {/* 타이틀 헤더 바 */}
      <div className="p-4 px-6 border-b border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          MEDIA REPORT / 관련 언론사 뉴스 리포트
        </span>
      </div>

      {/* 뉴스 목록 리스트 */}
      <div className="flex flex-col w-full">
        {newsList.map((news, idx) => (
          <div
            key={idx}
            onClick={() => window.open(news.url, "_blank")}
            className="p-6 border-b border-solid border-zinc-200 dark:border-zinc-800 last:border-none flex flex-col items-start cursor-pointer transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 box-border text-left"
          >
            <div className="flex items-center gap-3 mb-2.5 text-xs">
              <span className="text-[9px] font-bold py-0.5 px-2.5 rounded-full border border-solid border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 tracking-wider">
                {news.category}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500 font-semibold">{news.press}</span>
            </div>
            
            <h4 className="m-0 mb-2 text-md font-bold text-zinc-950 dark:text-zinc-50 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150">
              {news.title}
            </h4>
            
            <p className="m-0 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {news.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NewsTab;
