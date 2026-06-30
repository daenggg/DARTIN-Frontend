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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white dark:bg-[#121318] rounded-xl border border-solid border-[#f1f5f9] dark:border-zinc-800 text-[#475569] dark:text-zinc-400 text-center gap-6 font-sans w-full box-border">
    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
      NO SESSION DATA
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

  const revenueStr = latestYear ? formatMoney(fin[latestYear].revenue) : "-";
  const opProfitStr = latestYear ? formatMoney(fin[latestYear].operatingProfit) : "-";
  const debtRatioStr = latestYear ? `${fin[latestYear].debtRatio}%` : "-";

  const mappedNews = (analysisData.news || []).map((item) => ({
    press: "뉴스",
    title: item.title,
    desc: item.summary,
    time: item.publishedAt.split("T")[0],
    url: item.url,
  }));

  const aiFeedbackText = analysisData.aiAnalysis || "실시간 분석 진행 완료. 분석 탭에서 마크다운 리포트를 확인하실 수 있습니다.";

  const basicInfoItems = [
    { label: "대표이사", value: basic.ceo },
    { label: "본사 소재지", value: basic.address },
    { label: "설립 연도", value: `${basic.establishedYear}년` },
    { label: "임직원 수", value: basic.employeeCount ? `${basic.employeeCount.toLocaleString()}명` : "정보 없음" }
  ];

  return (
    <div className="border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#121318] w-full box-border text-[#18181b] dark:text-[#f4f4f5] text-left flex flex-col font-sans">
      
      {/* 0단계: 최상단 채용 공고 퀵 링크 바 */}
      {analysisData.jobLinks && (
        <div className="p-4 px-6 border-b border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            채용 정보 및 공고 퀵 링크
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(analysisData.jobLinks!.saramin, "_blank")}
              className="border border-solid border-zinc-900 dark:border-zinc-700 rounded-full py-1 px-3 text-xs font-semibold text-zinc-950 dark:text-zinc-50 bg-white dark:bg-[#121318] cursor-pointer transition-all duration-150 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950"
            >
              사람인
            </button>
            <button
              onClick={() => window.open(analysisData.jobLinks!.wanted, "_blank")}
              className="border border-solid border-zinc-900 dark:border-zinc-700 rounded-full py-1 px-3 text-xs font-semibold text-zinc-950 dark:text-zinc-50 bg-white dark:bg-[#121318] cursor-pointer transition-all duration-150 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950"
            >
              원티드
            </button>
            <button
              onClick={() => window.open(analysisData.jobLinks!.work24, "_blank")}
              className="border border-solid border-zinc-900 dark:border-zinc-700 rounded-full py-1 px-3 text-xs font-semibold text-zinc-950 dark:text-zinc-50 bg-white dark:bg-[#121318] cursor-pointer transition-all duration-150 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950"
            >
              워크24
            </button>
          </div>
        </div>
      )}
      
      {/* 1단계: 최상단 KPI 영역 (3열 격자 구조) */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full border-b border-solid border-zinc-200 dark:border-zinc-800 shrink-0">
        {/* 매출액 */}
        <div className="p-6 flex flex-col items-start text-left">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">01 / 연간 매출액</span>
          <p className="text-3xl font-black text-zinc-950 dark:text-zinc-50 mt-1.5 tracking-tight">{revenueStr}</p>
          <span className="text-xs text-zinc-500 dark:text-zinc-455 mt-1">{latestYear ? `${latestYear}년 실적 기준` : ""}</span>
        </div>

        {/* 영업이익 */}
        <div className="p-6 flex flex-col items-start text-left border-solid border-zinc-200 dark:border-zinc-800 md:border-l max-md:border-t">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">02 / 연간 영업이익</span>
          <p className="text-3xl font-black text-zinc-950 dark:text-zinc-50 mt-1.5 tracking-tight">{opProfitStr}</p>
          <span className="text-xs text-zinc-500 dark:text-zinc-455 mt-1">{latestYear ? `${latestYear}년 실적 기준` : ""}</span>
        </div>

        {/* 부채비율 */}
        <div className="p-6 flex flex-col items-start text-left border-solid border-zinc-200 dark:border-zinc-800 md:border-l max-md:border-t">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">03 / 최근 부채비율</span>
          <p className="text-3xl font-black text-zinc-950 dark:text-zinc-50 mt-1.5 tracking-tight">{debtRatioStr}</p>
          <span className="text-xs text-zinc-500 dark:text-zinc-455 mt-1">{latestYear ? `${latestYear}년 실적 기준` : ""}</span>
        </div>
      </div>

      {/* 2단계: 중단 영역 (좌우 2분할 격자 구조) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full border-b border-solid border-zinc-200 dark:border-zinc-800">
        
        {/* 좌측 기업 프로필 */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between border-solid border-zinc-200 dark:border-zinc-800 lg:border-r max-lg:border-b box-border">
          <div>
            <div className="flex items-baseline gap-2 mb-5">
              <h3 className="m-0 text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                {basic.companyName}
              </h3>
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider">
                [{basic.isListed ? basic.stockMarket || "KOSPI" : "CORP"}]
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {basicInfoItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline py-1 border-b border-solid border-zinc-100 dark:border-zinc-900 text-sm">
                  <span className="text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px] shrink-0">{item.label}</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium text-right pl-4 truncate max-w-[320px]" title={item.value}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 채용 링크 최상단 이동 완료 */}
        </div>

        {/* 우측 미디어 타임라인 */}
        <div className="lg:col-span-6 p-6 flex flex-col box-border">
          <h4 className="m-0 mb-5 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-left">
            관련 최신 뉴스 타임라인
          </h4>

          <div className="flex flex-col gap-3.5">
            {mappedNews.length === 0 ? (
              <div className="text-sm text-zinc-400 dark:text-zinc-500 py-6 text-center">수집된 뉴스가 없습니다.</div>
            ) : (
              mappedNews.slice(0, 2).map((news, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(news.url, "_blank")}
                  className="flex flex-col items-start gap-1 cursor-pointer group border-b border-solid border-zinc-100 dark:border-zinc-900 pb-3 last:border-none last:pb-0"
                >
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                    {news.time}
                  </span>
                  <div className="w-full flex flex-col items-start text-left">
                    <h5 className="m-0 mb-1 text-sm font-bold text-zinc-950 dark:text-zinc-50 leading-snug group-hover:text-blue-600 transition-colors duration-150">
                      {news.title}
                    </h5>
                    <p className="m-0 text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed line-clamp-1">
                      {news.desc}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3단계: 하단 AI 종합 리포트 영역 */}
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900/30 w-full box-border text-left">
        <h4 className="m-0 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          AI 종합 분석 리포트
        </h4>
        <p className="m-0 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 tracking-tight">
          인공지능 모델의 주요 지식 분석 리포트 요약
        </p>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap pl-4 border-l border-solid border-zinc-300 dark:border-l-zinc-700">
          {aiFeedbackText}
        </div>
      </div>

    </div>
  );
};

export default DashboardTab;
