import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden px-4 box-border transition-colors duration-200"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* 1. 뒷배경 번짐 원 (블러 효과) */}
      <div
        className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-b from-rose-200/40 via-[#D4543D]/5 to-transparent dark:from-yellow-100/10 dark:via-[#D4543D]/5 dark:to-transparent blur-3xl z-0 pointer-events-none"
      />

      {/* 2. 글래스모피즘 컨텐츠 카드 */}
      <div
        className="relative z-10 w-full max-w-[380px] rounded-3xl border border-solid p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col items-center text-center box-border backdrop-blur-md transition-all duration-300"
        style={{
          background: "var(--bg-panel)",
          borderColor: "var(--border)",
        }}
      >
        {/* 상단 뱃지 로고 */}
        <span
          className="text-[9px] font-black tracking-widest uppercase mb-6 flex items-center gap-1.5"
          style={{ color: "var(--accent)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          DARTIN AI SYSTEM
        </span>

        {/* 돋보기와 분실 문서 일러스트 SVG */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#D4543D]/5 rounded-full blur-xl w-24 h-24 -translate-y-2" />
          <svg
            className="w-16 h-16 relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.85 }}
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <circle cx="10.5" cy="14.5" r="2.5" />
            <line x1="15" y1="19" x2="12.3" y2="16.3" />
          </svg>
        </div>

        {/* 대형 404 타이틀 */}
        <h1
          className="text-6xl font-black tracking-tighter m-0 mb-1 leading-none select-none"
          style={{
            color: "var(--text-h)",
            fontFamily: '"Outfit", "Nunito", sans-serif',
          }}
        >
          404
        </h1>

        {/* 상세 메시지 */}
        <h2
          className="m-0 text-md font-extrabold tracking-tight mb-2"
          style={{ color: "var(--text-h)" }}
        >
          페이지를 찾을 수 없습니다
        </h2>

        <p
          className="m-0 text-xs leading-relaxed mb-8 max-w-[280px]"
          style={{ color: "var(--text)" }}
        >
          주소가 변경되었거나 삭제되어 접근할 수 없는 경로입니다. 주소를 다시 한 번 확인해 주시기 바랍니다.
        </p>

        {/* 홈으로 이동 버튼 */}
        <button
          onClick={() => navigate("/home")}
          className="w-full py-3.5 px-6 rounded-full text-xs font-bold cursor-pointer text-white transition-all duration-200 border-none shadow-md hover:shadow-lg hover:-translate-y-0.5 select-none"
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          홈 화면으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default NotFound;
