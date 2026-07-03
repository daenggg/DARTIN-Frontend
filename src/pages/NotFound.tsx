import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-[#fcfcfc] font-sans text-[#18181b] p-6 box-border z-[99999]">
      <div className="text-[120px] font-black text-black mb-5 opacity-50 tracking-[5px] leading-none">
        404
      </div>

      <h1 className="text-4xl font-bold text-[#0f172a] mb-3 tracking-tight">
        요청하신 페이지를 찾을 수 없습니다
      </h1>

      <p className="text-sm leading-relaxed text-[#64748b] max-w-[400px] text-center mb-8">
        존재하지 않거나 삭제된 경로입니다. 입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
      </p>

      <button
        onClick={() => navigate("/home")}
        className="py-3 px-6 bg-[#18181b] text-white rounded-full text-xs font-semibold cursor-pointer transition-colors duration-200 shadow-md hover:bg-[#27272a] border-none"
      >
        홈 화면으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
