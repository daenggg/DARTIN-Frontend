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
      NO SESSION DATA
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

const formatMoney = (val: number): string => {
  if (val >= 1e12) {
    return `${(val / 1e12).toFixed(1)}조원`;
  }
  return `${Math.round(val / 1e8).toLocaleString()}억원`;
};

const DashboardTab: React.FC<DashboardTabProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.basicInfo) {
    return <EmptyState />;
  }

  const basic = analysisData.basicInfo;
  const fin = analysisData.financialInfo || {};
  const sortedYears = Object.keys(fin).sort();
  const latestYear = sortedYears[sortedYears.length - 1];

  const revenueStr = latestYear ? formatMoney(fin[latestYear].revenue) : "-";
  const opProfitStr = latestYear
    ? formatMoney(fin[latestYear].operatingProfit)
    : "-";
  const debtRatioStr = latestYear ? `${fin[latestYear].debtRatio}%` : "-";

  const mappedNews = (analysisData.news || []).map((item) => ({
    press: "뉴스",
    title: item.title,
    desc: item.summary,
    time: item.publishedAt.split("T")[0],
    url: item.url,
  }));

  const aiFeedbackText =
    analysisData.aiAnalysis ||
    "실시간 분석 진행 완료. 분석 탭에서 마크다운 리포트를 확인하실 수 있습니다.";

  const basicInfoItems = [
    { label: "대표이사", value: basic.ceo },
    { label: "본사 소재지", value: basic.address },
    { label: "설립 연도", value: `${basic.establishedYear}년` },
    {
      label: "임직원 수",
      value: basic.employeeCount
        ? `${basic.employeeCount.toLocaleString()}명`
        : "정보 없음",
    },
  ];

  return (
    <div
      className="border border-solid rounded-2xl overflow-hidden w-full box-border text-left flex flex-col font-sans"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-panel)",
        color: "var(--text)",
      }}
    >
      {/* 0단계: 최상단 채용 공고 퀵 링크 바 */}
      {analysisData.jobLinks && (
        <div
          className="p-2.5 px-5 border-b border-solid flex items-center justify-between shrink-0 max-sm:flex-col max-sm:gap-3 max-sm:items-start"
          style={{
            borderBottomColor: "var(--border)",
            background: "var(--bg)",
          }}
        >
          <span
            className="text-xs md:text-sm font-extrabold uppercase tracking-wider"
            style={{ color: "var(--text-h)" }}
          >
            채용 정보 및 공고 퀵 링크
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                window.open(analysisData.jobLinks!.saramin, "_blank")
              }
              className="border border-solid rounded-full py-1 px-3 text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-panel)",
                color: "var(--text-h)",
              }}
            >
              사람인
            </button>
            <button
              onClick={() =>
                window.open(analysisData.jobLinks!.wanted, "_blank")
              }
              className="border border-solid rounded-full py-1 px-3 text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-panel)",
                color: "var(--text-h)",
              }}
            >
              원티드
            </button>
            <button
              onClick={() =>
                window.open(analysisData.jobLinks!.work24, "_blank")
              }
              className="border border-solid rounded-full py-1 px-3 text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-panel)",
                color: "var(--text-h)",
              }}
            >
              워크24
            </button>
          </div>
        </div>
      )}

      {/* 1단계: 최상단 KPI 영역 (3열 격자 구조) */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 w-full border-b border-solid shrink-0"
        style={{ borderBottomColor: "var(--border)" }}
      >
        {/* 매출액 */}
        <div className="p-6 flex flex-col items-start text-left">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text)" }}
          >
            01 / 연간 매출액
          </span>
          <p
            className="text-3xl font-black mt-1.5 tracking-tight"
            style={{ color: "var(--text-h)" }}
          >
            {revenueStr}
          </p>
          <span className="text-xs mt-1" style={{ color: "var(--text)" }}>
            {latestYear ? `${latestYear}년 실적 기준` : ""}
          </span>
        </div>

        {/* 영업이익 */}
        <div
          className="p-6 flex flex-col items-start text-left border-solid md:border-l max-md:border-t"
          style={{
            borderLeftColor: "var(--border)",
            borderTopColor: "var(--border)",
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text)" }}
          >
            02 / 연간 영업이익
          </span>
          <p
            className="text-3xl font-black mt-1.5 tracking-tight"
            style={{ color: "var(--text-h)" }}
          >
            {opProfitStr}
          </p>
          <span className="text-xs mt-1" style={{ color: "var(--text)" }}>
            {latestYear ? `${latestYear}년 실적 기준` : ""}
          </span>
        </div>

        {/* 부채비율 */}
        <div
          className="p-6 flex flex-col items-start text-left border-solid md:border-l max-md:border-t"
          style={{
            borderLeftColor: "var(--border)",
            borderTopColor: "var(--border)",
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text)" }}
          >
            03 / 최근 부채비율
          </span>
          <p
            className="text-3xl font-black mt-1.5 tracking-tight"
            style={{ color: "var(--text-h)" }}
          >
            {debtRatioStr}
          </p>
          <span className="text-xs mt-1" style={{ color: "var(--text)" }}>
            {latestYear ? `${latestYear}년 실적 기준` : ""}
          </span>
        </div>
      </div>

      {/* 2단계: 중단 영역 (좌우 2분할 격자 구조) */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 w-full border-b border-solid"
        style={{ borderBottomColor: "var(--border)" }}
      >
        {/* 좌측 기업 프로필 */}
        <div
          className="lg:col-span-6 p-6 flex flex-col justify-between border-solid lg:border-r max-lg:border-b box-border"
          style={{
            borderRightColor: "var(--border)",
            borderBottomColor: "var(--border)",
          }}
        >
          <div>
            <div className="flex items-baseline gap-2 mb-5">
              <h3
                className="m-0 text-2xl font-bold tracking-tight"
                style={{ color: "var(--text-h)" }}
              >
                {basic.companyName}
              </h3>
              <span
                className="text-xs font-semibold tracking-wider"
                style={{ color: "var(--text)" }}
              >
                [{basic.isListed ? basic.stockMarket || "KOSPI" : "CORP"}]
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {basicInfoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-baseline py-1 border-b border-solid text-sm"
                  style={{ borderBottomColor: "var(--border)" }}
                >
                  <span
                    className="font-semibold uppercase tracking-wider text-[10px] shrink-0"
                    style={{ color: "var(--text)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="font-medium text-right pl-4 truncate max-w-[320px]"
                    style={{ color: "var(--text-h)" }}
                    title={item.value}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우측 미디어 타임라인 */}
        <div className="lg:col-span-6 p-6 flex flex-col box-border">
          <h4
            className="m-0 mb-3 text-xs md:text-sm font-extrabold uppercase tracking-wider text-left"
            style={{ color: "var(--text-h)" }}
          >
            관련 최신 뉴스 타임라인
          </h4>

          <div className="flex flex-col gap-3.5">
            {mappedNews.length === 0 ? (
              <div
                className="text-sm py-6 text-center"
                style={{ color: "var(--text)" }}
              >
                수집된 뉴스가 없습니다.
              </div>
            ) : (
              mappedNews.slice(0, 2).map((news, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(news.url, "_blank")}
                  className="flex flex-col items-start gap-1 cursor-pointer group border-b border-solid pb-3 last:border-none last:pb-0"
                  style={{ borderBottomColor: "var(--border)" }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {news.time}
                  </span>
                  <div className="w-full flex flex-col items-start text-left">
                    <h5
                      className="m-0 mb-1 text-sm font-bold leading-snug group-hover:text-[var(--accent)] transition-colors duration-150"
                      style={{ color: "var(--text-h)" }}
                    >
                      {news.title}
                    </h5>
                    <p
                      className="m-0 text-xs leading-relaxed line-clamp-1"
                      style={{ color: "var(--text)" }}
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

      {/* 3단계: 하단 AI 종합 리포트 영역 */}
      <div
        className="p-4 px-5 w-full box-border text-left"
        style={{ background: "var(--bg)" }}
      >
        <h4
          className="m-0 mb-1.5 text-xs md:text-sm font-extrabold uppercase tracking-wider"
          style={{ color: "var(--text-h)" }}
        >
          AI 종합 분석 리포트
        </h4>
        <p
          className="m-0 text-xs font-bold mb-3 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          인공지능 모델의 주요 지식 분석 리포트 요약
        </p>
        <div
          className="text-sm leading-relaxed whitespace-pre-wrap pl-4 border-l border-solid"
          style={{ color: "var(--text)", borderLeftColor: "var(--border)" }}
        >
          {aiFeedbackText}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
