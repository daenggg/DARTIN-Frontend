import React from "react";

const LoginPreviewCards: React.FC = () => {
  return (
    <div className="relative w-full max-w-[380px] md:max-w-[420px] h-[460px] md:h-[490px] select-none flex items-center justify-center -translate-x-4 -translate-y-2">
      
      {/* CARD 3: 최후면 (Z-INDEX: 10) - [DARTIN 대시보드 메인 탭 (DashboardTab)] */}
      <div 
        className="absolute w-[92%] h-[90%] rounded-xl border border-solid shadow-md rotate-[4deg] translate-x-8 translate-y-12 z-10 transition-all duration-300 hover:rotate-0 hover:scale-[1.04] hover:z-50 hover:shadow-2xl cursor-pointer flex flex-col overflow-hidden font-sans"
        style={{ 
          background: "var(--bg-panel)", 
          borderColor: "var(--border)",
          color: "var(--text)"
        }}
      >
        {/* 상단 탭 헤더 (맥북 윈도우 창 대신 실제 대시보드 네비바와 싱크 맞춤) */}
        <div 
          className="h-10 border-b border-solid px-3 flex items-center shrink-0 gap-3"
          style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
        >
          <span className="text-[9px] font-extrabold relative h-full flex items-center" style={{ color: "var(--text-h)" }}>
            대시보드
            <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "var(--text-h)" }} />
          </span>
          <span className="text-[9px] font-medium" style={{ color: "var(--text)" }}>기업정보</span>
          <span className="text-[9px] font-medium" style={{ color: "var(--text)" }}>재무제표</span>
          <span className="text-[9px] font-medium" style={{ color: "var(--text)" }}>최신뉴스</span>
        </div>

        {/* 실제 대시보드 탭 내부 내용 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* 채용 공고 퀵 링크 */}
          <div 
            className="p-2 border-b border-solid flex items-center justify-between shrink-0"
            style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
          >
            <span className="text-[7.5px] font-extrabold uppercase tracking-wide" style={{ color: "var(--text-h)" }}>
              채용 정보 퀵 링크
            </span>
            <div className="flex gap-1 select-none">
              <span className="border border-solid rounded-full px-1.5 py-0.5 text-[6.5px] font-bold bg-[var(--bg-panel)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>사람인</span>
              <span className="border border-solid rounded-full px-1.5 py-0.5 text-[6.5px] font-bold bg-[var(--bg-panel)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>원티드</span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col gap-2.5 flex-1 overflow-hidden">
            {/* KPI 카드 구역 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded border border-solid flex flex-col justify-center" style={{ borderColor: "var(--border)" }}>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>01 / 매출액</span>
                <span className="text-xs font-black font-mono mt-0.5" style={{ color: "var(--text-h)" }}>3.69조원</span>
                <span className="text-[6.5px] mt-0.5" style={{ color: "var(--text)" }}>2024년 실적</span>
              </div>
              <div className="p-2 rounded border border-solid flex flex-col justify-center" style={{ borderColor: "var(--border)" }}>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>02 / 영업이익</span>
                <span className="text-xs font-black font-mono mt-0.5" style={{ color: "var(--text-h)" }}>1.15조원</span>
                <span className="text-[6.5px] mt-0.5" style={{ color: "var(--text)" }}>2024년 실적</span>
              </div>
            </div>

            {/* 수집 프로세스 로그 구역 */}
            <div className="flex flex-col gap-1 p-2 rounded-lg border border-solid text-[8px]" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span style={{ color: "var(--text-h)" }}>DART 기업개황 수집 완료</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span style={{ color: "var(--text-h)" }}>뉴스 4건 임베딩 완료</span>
              </div>
            </div>

            {/* AI 종합 진단 */}
            <div className="p-2 rounded-lg border border-solid text-[8px] leading-relaxed" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              <strong className="block mb-0.5" style={{ color: "var(--text-h)" }}>💡 DARTIN AI 종합 진단</strong>
              <p className="m-0 leading-normal font-medium truncate" style={{ color: "var(--text)" }}>
                수주 호조로 연간 매출 3.7조원 돌파. 높은 이익률로 재무 건전성 최고 등급.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* CARD 2: 중간 (Z-INDEX: 20) - [DARTIN 재무제표 탭 (FinancialsTab)] */}
      <div 
        className="absolute w-[92%] h-[90%] rounded-xl border border-solid shadow-xl rotate-[-3deg] -translate-x-4 translate-y-6 z-20 transition-all duration-300 hover:rotate-0 hover:scale-[1.04] hover:z-50 hover:opacity-100 hover:shadow-2xl cursor-pointer flex flex-col overflow-hidden font-sans"
        style={{ 
          background: "var(--bg-panel)", 
          borderColor: "var(--border)",
          color: "var(--text)"
        }}
      >
        {/* 실제 DashboardNavbar 형태 */}
        <div 
          className="h-10 border-b border-solid px-3 flex items-center shrink-0 gap-3"
          style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
        >
          <span className="text-[9px] font-medium" style={{ color: "var(--text)" }}>대시보드</span>
          <span className="text-[9px] font-medium" style={{ color: "var(--text)" }}>기업정보</span>
          <span className="text-[9px] font-extrabold relative h-full flex items-center" style={{ color: "var(--text-h)" }}>
            재무제표
            <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "var(--text-h)" }} />
          </span>
          <span className="text-[9px] font-medium" style={{ color: "var(--text)" }}>최신뉴스</span>
        </div>

        {/* 요약 재무 테이블 프리뷰 */}
        <div className="p-4 flex flex-col gap-3 flex-1 overflow-hidden">
          <span className="text-[8px] font-bold tracking-wider uppercase block" style={{ color: "var(--accent)" }}>
            SUMMARY FINANCIALS
          </span>
          <table className="w-full border-collapse text-[10px] text-left">
            <thead>
              <tr className="border-b border-solid" style={{ borderBottomColor: "var(--border)" }}>
                <th className="pb-1 font-semibold" style={{ color: "var(--text)" }}>구분 (단위: 조)</th>
                <th className="pb-1 font-semibold" style={{ color: "var(--text)" }}>2022</th>
                <th className="pb-1 font-semibold" style={{ color: "var(--text)" }}>2023</th>
                <th className="pb-1 font-semibold" style={{ color: "var(--text)" }}>2024</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-solid" style={{ borderBottomColor: "var(--border)" }}>
                <td className="py-1 font-medium" style={{ color: "var(--text-h)" }}>매출액</td>
                <td className="py-1 font-mono text-zinc-500">3.00</td>
                <td className="py-1 font-mono text-zinc-500">3.69</td>
                <td className="py-1 font-mono text-emerald-600 dark:text-emerald-500 font-bold">4.20</td>
              </tr>
              <tr className="border-b border-solid" style={{ borderBottomColor: "var(--border)" }}>
                <td className="py-1 font-medium" style={{ color: "var(--text-h)" }}>영업이익</td>
                <td className="py-1 font-mono text-zinc-500">0.98</td>
                <td className="py-1 font-mono text-zinc-500">1.15</td>
                <td className="py-1 font-mono text-emerald-600 dark:text-emerald-500 font-bold">1.32</td>
              </tr>
              <tr>
                <td className="py-1 font-medium" style={{ color: "var(--text-h)" }}>부채비율</td>
                <td className="py-1 font-mono text-zinc-500">79%</td>
                <td className="py-1 font-mono text-zinc-500">78%</td>
                <td className="py-1 font-mono text-zinc-500">76%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CARD 1: 최전면 (Z-INDEX: 30) - [DARTIN AI 대화창 (ChatArea)] */}
      <div 
        className="absolute w-[92%] h-[90%] rounded-xl border border-solid shadow-2xl rotate-[-8deg] -translate-x-16 translate-y-0 z-30 transition-all duration-300 hover:rotate-0 hover:scale-[1.04] hover:z-50 hover:opacity-100 hover:shadow-2xl cursor-pointer flex flex-col overflow-hidden font-sans"
        style={{ 
          background: "var(--bg-panel)", 
          borderColor: "var(--border)",
          color: "var(--text)"
        }}
      >
        {/* 실제 채팅창과 똑같은 상단 헤더 */}
        <div 
          className="h-10 border-b border-solid px-3 flex items-center justify-between shrink-0 select-none"
          style={{ borderBottomColor: "var(--border)", background: "var(--bg-panel)" }}
        >
          <div className="flex items-center gap-2">
            <svg 
              width="13" 
              height="13" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--text)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ opacity: 0.85 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <span className="text-[10px] font-black tracking-tight" style={{ color: "var(--text-h)" }}>
              삼성바이오로직스
            </span>
          </div>
          <span className="text-[9px] font-bold" style={{ color: "var(--text)" }}>진단 완료</span>
        </div>

        {/* 채팅 피드 (실제 UI처럼 100% 동일하게 복원 및 대화 내용 보강) */}
        <div className="p-3.5 flex flex-col gap-4 flex-1 overflow-hidden text-[10px] leading-relaxed">
          {/* 첫 번째 대화 쌍 */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-end">
              <div 
                className="px-2.5 py-1.5 rounded-lg rounded-tr-none text-left" 
                style={{ background: "var(--bg)", color: "var(--text-h)" }}
              >
                삼성바이오로직스 궁금해 분석해줘!
              </div>
            </div>
            
            <div className="flex gap-2 max-w-[95%] items-start">
              <div className="w-5 h-5 rounded-full bg-[#777777] flex items-center justify-center text-white text-[8px] font-semibold shrink-0">
                AI
              </div>
              <div 
                className="pt-0.5 text-left flex-1 font-medium whitespace-pre-wrap animate-pulse" 
                style={{ color: "var(--text-h)" }}
              >
                "삼성바이오로직스"에 대한 상세 실시간 분석이 완료되었습니다! 대시보드 및 각 상단 탭에서 상세 리포트를 확인해 보세요.
              </div>
            </div>
          </div>

          {/* 두 번째 대화 쌍 (추가 대화 데이터, 구분선 제거) */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-col items-end">
              <div 
                className="px-2.5 py-1.5 rounded-lg rounded-tr-none text-left" 
                style={{ background: "var(--bg)", color: "var(--text-h)" }}
              >
                재무 안정성이랑 채용, 최근 뉴스 요약도 상세히 볼 수 있어?
              </div>
            </div>
            
            <div className="flex gap-2 max-w-[95%] items-start">
              <div className="w-5 h-5 rounded-full bg-[#777777] flex items-center justify-center text-white text-[8px] font-semibold shrink-0">
                AI
              </div>
              <div 
                className="pt-0.5 text-left flex-1 font-medium whitespace-pre-wrap" 
                style={{ color: "var(--text-h)" }}
              >
                네, 실시간으로 추출한 다차원 정보 요약 브리핑입니다.
                {"\n"}
                {"\n"}1. <strong>재무 분석 및 안정성</strong>
                {"\n"}• 연 매출액 3.69조원 돌파 및 영업이익 1.15조원 달성
                {"\n"}• 부채비율은 70%대 중반으로 극히 건전한 재무 상태 유지
                {"\n"}
                {"\n"}2. <strong>최신 뉴스 분석</strong>
                {"\n"}• 5공장 연내 조기 착공 소식으로 생산 Capa 1위 수성 전망
                {"\n"}• 긍정 여론 비율이 82% 이상으로 매우 우호적인 평가 지배적
                {"\n"}
                {"\n"}3. <strong>채용 정보 연동</strong>
                {"\n"}• 현재 사람인, 원티드에 연구 개발 및 수주팀 공고 활성화
                {"\n"}• 총 4건의 핵심 공고가 진행 중이며 바이오 인력 확보 집중
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPreviewCards;
