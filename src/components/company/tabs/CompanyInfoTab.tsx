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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white rounded-xl border border-solid border-[#f1f5f9] shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_30px_rgba(0,0,0,0.02)] text-[#475569] text-center gap-6 font-sans w-full box-border">
    <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-solid border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-xs font-semibold tracking-wider">
      PROFILE
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

const CompanyInfoTab: React.FC<CompanyInfoTabProps> = ({ analysisData }) => {
  const basicInfo = analysisData?.basicInfo;

  if (!basicInfo) {
    return <EmptyState />;
  }

  const infoItems = [
    { label: "CEO (대표이사)", value: basicInfo.ceo },
    { label: "설립일", value: `${basicInfo.establishedYear}년` },
    { label: "직원 수 (임직원)", value: basicInfo.employeeCount ? `${basicInfo.employeeCount.toLocaleString()}명` : "-" },
    { label: "본사 소재지", value: basicInfo.address },
    { label: "주요 사업", value: basicInfo.industry || "기타 제조/서비스업" },
    { label: "상장 여부", value: basicInfo.isListed ? `${basicInfo.stockMarket || "KOSPI"} 상장` : "비상장" },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* 상세 개요 카드 */}
      <div className="bg-white rounded-lg p-6 border border-solid border-[#e4e4e7]">
        <h3 className="m-0 mb-5 text-lg font-bold text-[#18181b] text-left">
          기업 기본 정보
        </h3>
        <div className="grid grid-cols-2 gap-5">
          {infoItems.map((item, idx) => (
            <div
              key={idx}
              className="flex border-b border-solid border-[#f4f4f5] pb-3 text-md"
            >
              <span className="w-[140px] text-[#71717a] font-semibold text-left">{item.label}</span>
              <span className="text-[#18181b] font-bold text-left">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 비전 및 핵심 가치 */}
      <div className="bg-white rounded-lg p-6 border border-solid border-[#e4e4e7]">
        <h3 className="m-0 mb-5 text-lg font-bold text-[#18181b] text-left">
          핵심 기업 비전
        </h3>
        <div className="grid grid-cols-3 gap-4">
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
              className="bg-[#f4f4f5] p-5 rounded-md border border-solid border-[#e4e4e7]"
            >
              <h4 className="m-0 mb-2.5 text-md font-bold text-[#18181b] text-left">
                {card.title}
              </h4>
              <p className="m-0 text-sm text-[#71717a] leading-relaxed text-left">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTab;
