import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithKakao } from "../services/authApi";

// React StrictMode로 인해 로그인 컴포넌트 마운트 시 API가 중복 호출되어 일회성 코드가 만료되는 것을 방지하기 위한 전역 플래그
let isSent = false;

const Login = (): React.JSX.Element => {
  const navigate = useNavigate();
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = (): void => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  const [isExchanging, setIsExchanging] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 카카오 코드 파싱 및 로그인 요청 수행
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      if (isSent) return;
      isSent = true;
      setIsExchanging(true);

      const sendCodeToBackend = async (kakaoCode: string) => {
        try {
          const data = await loginWithKakao(kakaoCode);
          if (data) {
            const { accessToken, user } = data;
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("user", JSON.stringify(user));
            navigate("/home");
          }
        } catch (error) {
          console.error("Login page token exchange error:", error);
          alert("로그인 처리 중 서버 오류가 발생했습니다.");
          navigate("/", { replace: true });
        } finally {
          setIsExchanging(false);
          isSent = false;
        }
      };

      sendCodeToBackend(code);
    }
  }, [navigate]);

  return (
    <div 
      className="relative min-h-screen w-full font-sans overflow-hidden box-border flex flex-col justify-between pt-2 px-4 md:px-6 pb-6 transition-colors duration-200"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* 커스텀 키프레임 애니메이션 선언 */}
      <style>{`
        @keyframes riseUp {
          0% {
            transform: translate(-50%, 250px) scale(0.85);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 0.95;
          }
        }
      `}</style>

      {/* 1. 백그라운드 태양/달 */}
      <div
        className="absolute bottom-[-240px] md:bottom-[-350px] left-1/2 w-[640px] md:w-[900px] h-[640px] md:h-[900px] rounded-full bg-gradient-to-b from-rose-200 via-pink-100 to-amber-100/40 dark:from-yellow-100/80 dark:via-amber-300/30 dark:to-transparent blur-xs z-0 pointer-events-none transition-all duration-200"
        style={{
          animation: "riseUp 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      />

      {/* 상단 네비게이션 헤더 바 */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:px-8 z-40 select-none box-border">
        {/* 로고 */}
        <span
          className="text-2xl font-black tracking-tight flex items-center gap-1.5"
          style={{
            color: "var(--text-h)",
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4543D]" />
          DARTIN
        </span>

        {/* 중앙 서브 네비게이션 링크 */}
        <nav 
          className="hidden md:flex items-center gap-8 text-xs font-semibold"
          style={{ color: "var(--text)" }}
        >
          <span className="cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors">
            이용 방법
          </span>
          <span className="cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors">
            핵심 기능
          </span>
          <span className="cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors">
            보안
          </span>
        </nav>

        {/* 우측 테마 버튼 그룹 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="border border-solid border-zinc-200 dark:border-zinc-850 bg-transparent p-1.5 rounded-lg cursor-pointer text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors duration-200"
            title={theme === "light" ? "다크모드 켜기" : "라이트모드 켜기"}
          >
            {theme === "light" ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 메인 히어로 컨텐츠 (프리미엄 2열 스플릿 레이아웃) */}
      <main className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-40 px-4 md:px-8 box-border mt-4 mb-6 overflow-y-auto lg:overflow-visible">
        {/* 좌측 컬럼 */}
        <div className="lg:col-span-7 flex flex-col text-left items-start select-none">
          <div className="border border-solid border-[#D4543D]/30 text-[#D4543D] text-[10px] md:text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider select-none bg-[#D4543D]/5 inline-block">
            AI 기업 진단 서비스
          </div>

          <h1
            className="text-4xl md:text-[52px] lg:text-[56px] font-black tracking-tight leading-[1.15] m-0 transition-colors duration-200 text-left select-none mt-3 md:mt-4"
            style={{ color: "var(--text-h)", fontFamily: '"Outfit", "Nunito", sans-serif' }}
          >
            이 회사,{" "}
            <span className="relative inline-block pb-0.5 border-b-[4px] border-solid border-[#D4543D]/80">
              들어가도 될까?
            </span>
            <br />
            공시·뉴스·공고를 <span className="text-[#D4543D]">한 번에</span> 묻다.
          </h1>

          <p 
            className="text-xs md:text-sm leading-relaxed max-w-lg m-0 text-left font-normal select-none mt-3 md:mt-4"
            style={{ color: "var(--text)" }}
          >
            사람인, 잡코리아, DART, 네이버 뉴스를 따로 뒤지지 마세요. 회사 이름
            하나만 검색하면{" "}
            <strong className="font-semibold" style={{ color: "var(--text-h)" }}>
              재무 상태, 최근 이슈, 채용 공고
            </strong>
            를 모아 AI가 취준생의 언어로 명쾌하게 대답합니다.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 md:mt-6">
            <button
              onClick={handleKakaoLogin}
              className="flex items-center justify-center gap-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-extrabold py-3.5 px-7 rounded-full text-xs md:text-sm cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 select-none border-none shrink-0"
            >
              💬 카카오로 3초 만에 시작하기 &rarr;
            </button>
          </div>
        </div>

        {/* 우측 컬럼: 문서 카드 모형 */}
        <div className="lg:col-span-5 w-full flex items-center justify-center relative mt-4 lg:mt-0">
          <div className="w-full max-w-[360px] md:max-w-[400px] bg-[#f4f2ea] border border-solid border-[#d7d4c8] rounded-xl p-6 shadow-2xl relative rotate-[-1deg] hover:rotate-0 transition-transform duration-350 text-left box-border font-serif text-[#2c2b2a]">
            <div className="border-b border-solid border-[#d7d4c8] pb-4 select-none relative">
              <span className="text-[10px] uppercase tracking-widest text-[#7c786a] block mb-1">
                Company Dossier · No. 2026-0417
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#1c1b1a] m-0 tracking-tight">
                (주)테크노바
              </h3>
              <div className="absolute right-0 top-0 border-[2px] border-dashed border-[#D4543D] text-[#D4543D] text-[10px] md:text-xs font-black rounded-full w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center rotate-[-15deg] select-none opacity-85">
                <span className="text-[9px] uppercase leading-none font-sans">
                  DARTIN
                </span>
                <span className="font-bold leading-tight font-sans">
                  AI 진단
                </span>
                <span className="text-[9px] leading-none font-sans">완료</span>
              </div>
            </div>

            <div className="pt-5 flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-dotted border-[#d7d4c8]">
                <span className="text-[#6c685b]">최근 매출 성장률</span>
                <span className="font-bold text-emerald-700 font-mono">
                  +18.4%
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dotted border-[#d7d4c8]">
                <span className="text-[#6c685b]">영업이익률</span>
                <span className="font-bold text-emerald-700 font-mono">
                  12.1%
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dotted border-[#d7d4c8]">
                <span className="text-[#6c685b]">부채비율</span>
                <span className="font-bold text-[#D4543D] font-mono">
                  주의 · 138%
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-[#e9e6dc] text-[#5c584d] text-[10px] px-2 py-0.5 rounded border border-solid border-[#d7d4c8] font-sans">
                  #신사업 확장
                </span>
                <span className="bg-[#e9e6dc] text-[#5c584d] text-[10px] px-2 py-0.5 rounded border border-solid border-[#d7d4c8] font-sans">
                  #인원 채용 확대
                </span>
                <span className="bg-[#e9e6dc] text-[#5c584d] text-[10px] px-2 py-0.5 rounded border border-solid border-[#d7d4c8] font-sans">
                  #해외 진출
                </span>
              </div>

              <div className="mt-2 text-xs leading-relaxed text-[#4c483d] bg-[#eae7de]/60 p-3.5 rounded-lg border border-solid border-[#e0ddcf] font-sans">
                <strong className="text-[#1c1b1a] block mb-1">
                  💡 AI 요약
                </strong>
                "매출은 꾸준히 늘고 있지만 부채비율이 다소 높은 편. 최근 2건
                게재, 신규 사업팀 확대 중."
              </div>
            </div>

            <div className="absolute bottom-[-24px] -left-8 md:-left-12 max-w-[220px] bg-zinc-900/95 dark:bg-zinc-950/95 text-white p-3 rounded-lg border border-solid border-zinc-800 shadow-xl text-[10px] md:text-xs z-50 text-left font-sans flex flex-col gap-1 transition-all duration-300 hover:scale-105 select-none leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[9px] uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NAVER NEWS · 3일 전
              </div>
              <div className="text-zinc-100 font-medium">
                "테크노바, 2공장 증설 위해 500억 투자 결정"
              </div>
            </div>
          </div>
        </div>
      </main>



      {/* 카카오 토큰 교환 중 로딩 팝업 */}
      {isExchanging && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px] z-50 transition-all duration-200">
          <div className="bg-white dark:bg-[#181920] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3.5 max-w-[240px] w-full text-center box-border">
            <div 
              className="w-7 h-7 border-[3px] border-solid rounded-full animate-spin" 
              style={{ borderColor: "rgba(0,0,0,0.05)", borderTopColor: "var(--accent)" }}
            />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 select-none">
              카카오 로그인 처리 중...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
