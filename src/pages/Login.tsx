import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithKakao } from "../services/authApi";
import LoginPreviewCards from "../components/login/LoginPreviewCards";

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
      className="relative min-h-screen w-full lg:h-screen lg:overflow-hidden font-sans box-border flex flex-col justify-between pt-2 px-4 md:px-6 pb-6 transition-colors duration-200"
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
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-3 px-4 md:px-8 z-40 select-none box-border shrink-0">
        {/* 로고 */}
        <span
          className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-1.5"
          style={{
            color: "var(--text-h)",
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4543D]" />
          DARTIN
        </span>

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
      <main className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-40 px-4 md:px-8 box-border mt-2 mb-4 overflow-y-auto lg:overflow-visible">
        {/* 좌측 컬럼 */}
        <div className="lg:col-span-7 flex flex-col text-left items-start select-none">
          <div className="border border-solid border-[#D4543D]/30 text-[#D4543D] text-[10px] md:text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider select-none bg-[#D4543D]/5 inline-block">
            AI 기업 진단 서비스
          </div>

          <h1
            className="text-3xl md:text-[44px] lg:text-[48px] font-black tracking-tight leading-[1.15] m-0 transition-colors duration-200 text-left select-none mt-2 md:mt-3"
            style={{
              color: "var(--text-h)",
              fontFamily: '"Outfit", "Nunito", sans-serif',
            }}
          >
            이 회사,{" "}
            <span className="relative inline-block pb-0.5 border-b-[4px] border-solid border-[#D4543D]/80">
              들어가도 될까?
            </span>
            <br />
            공시·뉴스·공고를 <span className="text-[#D4543D]">
              한 번에
            </span>{" "}
            묻다.
          </h1>

          <p 
            className="text-xs md:text-[13px] leading-relaxed max-w-lg m-0 text-left font-normal select-none mt-2.5 md:mt-3"
            style={{ color: "var(--text)", wordBreak: "keep-all" }}
          >
            사람인, DART, 뉴스 플랫폼을 일일이 찾아다니며 조회할 필요가 없습니다.<br />
            회사 이름 하나만 검색하면{" "}
            <strong className="font-semibold" style={{ color: "var(--text-h)" }}>
              재무 상태, 최근 이슈, 채용 공고
            </strong>
            를 한눈에 모아<br />
            AI가 구직자의 언어로 명쾌하게 브리핑해 드립니다.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-5">
            <button
              onClick={handleKakaoLogin}
              className="flex items-center justify-center gap-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-extrabold py-3 px-6 rounded-full text-xs md:text-sm cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 select-none border-none shrink-0"
            >
              💬 카카오로 3초 만에 시작하기 &rarr;
            </button>
          </div>
        </div>

        {/* 우측 컬럼: 중첩 카드형 서비스 미리보기 컴포넌트 */}
        <div className="lg:col-span-5 w-full flex items-center justify-center relative mt-4 lg:mt-0">
          <LoginPreviewCards />
        </div>
      </main>

      {/* 카카오 토큰 교환 중 로딩 팝업 */}
      {isExchanging && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px] z-50 transition-all duration-200">
          <div className="bg-white dark:bg-[#181920] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3.5 max-w-[240px] w-full text-center box-border">
            <div
              className="w-7 h-7 border-[3px] border-solid rounded-full animate-spin"
              style={{
                borderColor: "rgba(0,0,0,0.05)",
                borderTopColor: "var(--accent)",
              }}
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
