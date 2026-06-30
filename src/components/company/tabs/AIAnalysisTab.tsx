import React from "react";
import { MarkdownRenderer } from "../../common/MarkdownRenderer";

interface AIAnalysisTabProps {
  analysisData?: {
    aiAnalysis?: string;
  };
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white rounded-xl border border-solid border-[#f1f5f9] shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_30px_rgba(0,0,0,0.02)] text-[#475569] text-center gap-6 font-sans w-full box-border">
    <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-solid border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-xs font-semibold tracking-wider">
      REPORT
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

const AIAnalysisTab: React.FC<AIAnalysisTabProps> = ({ analysisData }) => {
  const aiAnalysis = analysisData?.aiAnalysis;

  if (!aiAnalysis) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="bg-white rounded-[20px] p-7 border border-solid border-[#e3e3e3] leading-relaxed text-lg text-[#334155] text-left">
        <h3 className="m-0 mb-5 text-xl font-bold text-[#1f1f1f]">
          ✦ AI 종합 분석 리포트
        </h3>
        <MarkdownRenderer content={aiAnalysis} />
      </div>
    </div>
  );
};

export default AIAnalysisTab;
