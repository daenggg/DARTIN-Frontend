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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white dark:bg-[#121318] rounded-xl border border-solid border-[#f1f5f9] dark:border-zinc-800 text-[#475569] dark:text-zinc-400 text-center gap-6 font-sans w-full box-border">
    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
      NO PROFILE DATA
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

const CompanyInfoTab: React.FC<CompanyInfoTabProps> = ({ analysisData }) => {
  const basicInfo = analysisData?.basicInfo;

  if (!basicInfo) {
    return <EmptyState />;
  }

  const leftItems = [
    { label: "CEO (대표이사)", value: basicInfo.ceo },
    { label: "설립일", value: `${basicInfo.establishedYear}년` },
    { label: "직원 수 (임직원)", value: basicInfo.employeeCount ? `${basicInfo.employeeCount.toLocaleString()}명` : "정보 없음" },
  ];

  const rightItems = [
    { label: "본사 소재지", value: basicInfo.address },
    { label: "주요 사업", value: basicInfo.industry || "기타 제조/서비스업" },
    { label: "상장 여부", value: basicInfo.isListed ? `${basicInfo.stockMarket || "KOSPI"} 상장` : "비상장" },
  ];

  return (
    <div className="border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#121318] w-full box-border text-[#18181b] dark:text-[#f4f4f5] text-left flex flex-col font-sans">
      
      {/* 1단계: 기업 기본 정보 영역 */}
      <div className="p-4 px-6 border-b border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          CORPORATE PROFILE / 기업 기본 정보 명세
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full border-b border-solid border-zinc-200 dark:border-zinc-800">
        {/* 좌측 정보 컬럼 */}
        <div className="p-6 flex flex-col gap-4 border-solid border-zinc-200 dark:border-zinc-800 md:border-r max-md:border-b box-border">
          {leftItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-baseline py-1.5 border-b border-solid border-zinc-100 dark:border-zinc-900 text-sm">
              <span className="text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px] shrink-0">{item.label}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-medium text-right pl-4 truncate max-w-[240px]" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* 우측 정보 컬럼 */}
        <div className="p-6 flex flex-col gap-4 box-border">
          {rightItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-baseline py-1.5 border-b border-solid border-zinc-100 dark:border-zinc-900 text-sm">
              <span className="text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px] shrink-0">{item.label}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-medium text-right pl-4 truncate max-w-[240px]" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2단계: 핵심 기업 비전 영역 */}
      <div className="p-4 px-6 border-b border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
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
            className="p-6 flex flex-col border-solid border-zinc-200 dark:border-zinc-800 md:border-r max-md:border-b last:border-none md:last:border-none box-border"
          >
            <h4 className="m-0 mb-3 text-sm font-bold text-zinc-950 dark:text-zinc-50">
              {card.title}
            </h4>
            <p className="m-0 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CompanyInfoTab;
