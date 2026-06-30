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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white rounded-xl border border-solid border-[#f1f5f9] shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_30px_rgba(0,0,0,0.02)] text-[#475569] text-center gap-6 font-sans w-full box-border">
    <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-solid border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-xs font-semibold tracking-wider">
      ANALYSIS
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
    <div className="flex flex-col gap-5 font-sans w-full box-border">
      {/* 상단 2분할 레이아웃 */}
      <div className="flex gap-5 flex-wrap w-full">
        {/* 좌측 영역 */}
        <div className="flex-1 min-w-[320px] flex flex-col gap-5">
          {/* 기업 정보 카드 */}
          <div className="bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] flex flex-col gap-5 flex-1 box-border justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md border border-solid border-[#e4e4e7] flex items-center justify-center bg-[#f5f3ff] font-bold">
                  <div className="text-[#4f46e5] text-xs">
                    {basic.isListed ? basic.stockMarket || "KOSPI" : "CORP"}
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="m-0 text-2xl font-bold text-[#18181b]">
                    {basic.companyName}
                  </h3>
                  <p className="mt-1 text-sm text-[#71717a] m-0">
                    {basic.industry || "정보 없음"}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-sm text-[#4b5563] flex flex-col gap-1 text-left">
                <div><strong>대표이사:</strong> {basic.ceo}</div>
                <div><strong>본사 주소:</strong> {basic.address}</div>
                <div><strong>설립연도:</strong> {basic.establishedYear}년</div>
                <div><strong>임직원 수:</strong> {basic.employeeCount ? `${basic.employeeCount.toLocaleString()}명` : "정보 없음"}</div>
              </div>
            </div>

            {analysisData.jobLinks && (
              <div className="flex gap-2 flex-wrap mt-4">
                <button
                  onClick={() => window.open(analysisData.jobLinks!.saramin, "_blank")}
                  className="border border-solid border-[#e4e4e7] rounded-md py-1.5 px-3 text-xs font-semibold text-[#18181b] bg-white cursor-pointer transition-colors duration-150 hover:bg-slate-50"
                >
                  사람인 공고
                </button>
                <button
                  onClick={() => window.open(analysisData.jobLinks!.wanted, "_blank")}
                  className="border border-solid border-[#e4e4e7] rounded-md py-1.5 px-3 text-xs font-semibold text-[#18181b] bg-white cursor-pointer transition-colors duration-150 hover:bg-slate-50"
                >
                  원티드 공고
                </button>
                <button
                  onClick={() => window.open(analysisData.jobLinks!.work24, "_blank")}
                  className="border border-solid border-[#e4e4e7] rounded-md py-1.5 px-3 text-xs font-semibold text-[#18181b] bg-white cursor-pointer transition-colors duration-150 hover:bg-slate-50"
                >
                  워크24 공고
                </button>
              </div>
            )}
          </div>

          {/* 재무제표 요약 카드 */}
          <div className="bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] flex flex-col gap-4 flex-1 box-border">
            <h4 className="m-0 text-lg font-bold text-[#18181b] text-left">
              최근 실적 요약 ({latestYear ? `${latestYear}년` : ""})
            </h4>

            <div className="grid grid-cols-2 gap-4 flex-1 items-center">
              <div className="p-3 bg-[#f4f4f5] rounded-md border border-solid border-[#e4e4e7] h-full flex flex-col justify-center box-border items-start">
                <span className="text-xs text-[#71717a]">매출액</span>
                <p className="m-0 mt-1 text-xl font-bold text-[#18181b]">
                  {revenueStr}
                </p>
              </div>
              <div className="p-3 bg-[#f4f4f5] rounded-md border border-solid border-[#e4e4e7] h-full flex flex-col justify-center box-border items-start">
                <span className="text-xs text-[#71717a]">영업이익</span>
                <p className="m-0 mt-1 text-xl font-bold text-[#4f46e5]">
                  {opProfitStr}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 영역 - 최신 뉴스 */}
        <div className="flex-[1.2] min-w-[320px] bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] flex flex-col gap-5 box-border">
          <h4 className="m-0 text-lg font-bold text-[#18181b] text-left">
            최신 관련 뉴스
          </h4>

          <div className="flex flex-col gap-3 flex-1 justify-between">
            {mappedNews.length === 0 ? (
              <div className="text-sm text-[#71717a] py-6 text-center">수집된 뉴스가 없습니다.</div>
            ) : (
              mappedNews.slice(0, 3).map((news, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(news.url, "_blank")}
                  className="flex flex-row p-3 bg-[#f4f4f5] border border-solid border-[#e4e4e7] rounded-md cursor-pointer transition-colors duration-150 hover:border-[#a1a1aa] flex-1 items-center gap-3"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#e2e8f0] to-[#cbd5e1] rounded flex items-center justify-center text-lg shrink-0 border border-solid border-[#cbd5e1] box-border">
                    📰
                  </div>

                  <div className="flex-1 flex flex-col items-start text-left">
                    <span className="text-xs text-[#71717a] mb-1">
                      {news.press} • {news.time}
                    </span>
                    <h5 className="m-0 mb-1 text-sm font-bold text-[#1a73e8] leading-snug line-clamp-1">
                      {news.title}
                    </h5>
                    <p className="m-0 text-xs text-[#71717a] leading-normal line-clamp-2">
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
      <div className="bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] flex flex-col gap-5 w-full box-border">
        <h4 className="m-0 text-lg font-bold text-[#18181b] text-left">
          AI 종합 분석 피드백
        </h4>

        <div className="flex gap-2.5 items-start">
          <span className="text-sm text-[#18181b] font-bold shrink-0">
            ✦
          </span>
          <span className="text-sm text-[#71717a] leading-relaxed whitespace-pre-wrap text-left">
            {aiFeedbackText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
