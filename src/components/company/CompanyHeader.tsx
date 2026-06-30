import React from "react";

interface CompanyHeaderProps {
  companyName: string;
  description: string;
  onLogoClick?: () => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyName,
  description,
  onLogoClick,
}) => {
  const isSamsung = companyName.includes("삼성");

  return (
    <div className="bg-white rounded-[24px] py-6 px-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-solid border-[#e3e3e3] flex justify-between items-center font-sans">
      <div className="flex items-center gap-5">
        {/* 기업 브랜드 로고 */}
        <div
          onClick={onLogoClick}
          className="w-[68px] h-[68px] rounded-2xl border border-solid border-[#f0f4f9] flex items-center justify-center cursor-pointer bg-[#f0f4f9] p-1 box-border transition-transform duration-200 hover:scale-105"
        >
          {isSamsung ? (
            <div className="w-11 h-6 bg-[#0a58ca] rounded-full flex items-center justify-center text-white text-xs font-black">
              SAMSUNG
            </div>
          ) : (
            <div className="text-lg font-bold text-[#e11d48]">
              SK
            </div>
          )}
        </div>
        <div className="text-left">
          <h2 className="m-0 text-3xl font-bold text-[#1f1f1f]">
            {companyName}
          </h2>
          <p className="mt-1 text-md text-[#5f6368] m-0">
            {description}
          </p>
        </div>
      </div>

      {/* 채용 링크 (Gemini 캡슐 스타일 아웃라인 버튼) */}
      <div className="flex gap-2.5">
        {["사람인 공고 🔗", "잡코리아 공고 🔗", "원티드 공고 🔗"].map((text, idx) => (
          <button
            key={idx}
            onClick={() =>
              window.open(
                idx === 0
                  ? `https://www.saramin.co.kr/zf_user/search?searchword=${companyName}`
                  : idx === 1
                  ? `https://www.jobkorea.co.kr/Search/?stext=${companyName}`
                  : `https://www.wanted.co.kr/search?query=${companyName}`,
                "_blank"
              )
            }
            className="border border-solid border-[#cbd5e1] rounded-full py-2 px-4 text-sm font-semibold text-[#3c4043] bg-white cursor-pointer transition-all duration-200 hover:bg-[#f0f4f9] hover:border-[#a8a8a8]"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanyHeader;
