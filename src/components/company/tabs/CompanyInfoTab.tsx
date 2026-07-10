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
    className="flex flex-col items-center justify-center py-[120px] px-6 rounded-xl border border-solid text-center gap-6 font-sans w-full box-border"
    style={{ background: "var(--bg-panel)", borderColor: "var(--border)", color: "var(--text)" }}
  >
    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
      NO PROFILE DATA
    </div>
    
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-lg tracking-tight" style={{ color: "var(--text-h)" }}>
        데이터 분석 세션 대기 중
      </div>
      <div className="text-sm leading-relaxed max-w-[360px] mx-auto" style={{ color: "var(--text)" }}>
        실시간 기업 공시 정보, 재무 실적 추이 및 미디어 정보 추출을 시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
      </div>
    </div>
  </div>
);

const SkeletonBlock: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "", style }) => (
  <div
    className={`skeleton-shimmer rounded ${className}`}
    style={style}
  />
);

const CompanyInfoTab: React.FC<CompanyInfoTabProps> = ({ analysisData }) => {
  if (!analysisData) {
    return <EmptyState />;
  }

  const basicInfo = analysisData.basicInfo;

  const leftItems = basicInfo
    ? [
        { label: "CEO (대표이사)", value: basicInfo.ceo },
        { label: "설립일", value: `${basicInfo.establishedYear}년` },
        { label: "직원 수 (임직원)", value: basicInfo.employeeCount ? `${basicInfo.employeeCount.toLocaleString()}명` : "정보 없음" },
      ]
    : [];

  const rightItems = basicInfo
    ? [
        { label: "본사 소재지", value: basicInfo.address },
        { label: "주요 사업", value: basicInfo.industry || "기타 제조/서비스업" },
        { label: "상장 여부", value: basicInfo.isListed ? `${basicInfo.stockMarket || "KOSPI"} 상장` : "비상장" },
      ]
    : [];

  return (
    <div 
      className="border border-solid rounded-2xl overflow-hidden w-full box-border text-left flex flex-col font-sans"
      style={{ borderColor: "var(--border)", background: "var(--bg-panel)", color: "var(--text)" }}
    >
      
      {/* 1단계: 기업 기본 정보 영역 */}
      <div 
        className="p-2.5 px-5 border-b border-solid flex items-center justify-between shrink-0"
        style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
      >
        <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider" style={{ color: "var(--text-h)" }}>
          CORPORATE PROFILE / 기업 기본 정보 명세
        </span>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 w-full border-b border-solid"
        style={{ borderBottomColor: "var(--border)" }}
      >
        {/* 좌측 정보 컬럼 */}
        <div 
          className="p-6 flex flex-col gap-4 border-solid md:border-r max-md:border-b box-border"
          style={{ borderRightColor: "var(--border)", borderBottomColor: "var(--border)" }}
        >
          {basicInfo ? (
            leftItems.map((item, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-baseline py-1.5 border-b border-solid text-sm"
                style={{ borderBottomColor: "var(--border)" }}
              >
                <span className="font-semibold uppercase tracking-wider text-[10px] shrink-0" style={{ color: "var(--text)" }}>{item.label}</span>
                <span className="font-medium text-right pl-4 truncate max-w-[240px]" style={{ color: "var(--text-h)" }} title={item.value}>
                  {item.value}
                </span>
              </div>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex justify-between items-baseline py-2.5 border-b border-solid text-sm"
                style={{ borderBottomColor: "var(--border)" }}
              >
                <SkeletonBlock style={{ width: "80px", height: "12px" }} />
                <SkeletonBlock style={{ width: "140px", height: "12px" }} />
              </div>
            ))
          )}
        </div>

        {/* 우측 정보 컬럼 */}
        <div className="p-6 flex flex-col gap-4 box-border">
          {basicInfo ? (
            rightItems.map((item, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-baseline py-1.5 border-b border-solid text-sm"
                style={{ borderBottomColor: "var(--border)" }}
              >
                <span className="font-semibold uppercase tracking-wider text-[10px] shrink-0" style={{ color: "var(--text)" }}>{item.label}</span>
                <span className="font-medium text-right pl-4 truncate max-w-[240px]" style={{ color: "var(--text-h)" }} title={item.value}>
                  {item.value}
                </span>
              </div>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex justify-between items-baseline py-2.5 border-b border-solid text-sm"
                style={{ borderBottomColor: "var(--border)" }}
              >
                <SkeletonBlock style={{ width: "70px", height: "12px" }} />
                <SkeletonBlock style={{ width: "160px", height: "12px" }} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2단계: 핵심 기업 비전 영역 */}
      <div 
        className="p-2.5 px-5 border-b border-solid flex items-center justify-between shrink-0"
        style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
      >
        <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider" style={{ color: "var(--text-h)" }}>
          VISION & VALUES / 기업 핵심 비전
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
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
            className="p-6 flex flex-col border-solid md:border-r max-md:border-b last:border-none md:last:border-none box-border"
            style={{ borderRightColor: "var(--border)", borderBottomColor: "var(--border)" }}
          >
            <h4 className="m-0 mb-3 text-sm font-bold" style={{ color: "var(--text-h)" }}>
              {card.title}
            </h4>
            <p className="m-0 text-xs leading-relaxed" style={{ color: "var(--text)" }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CompanyInfoTab;
