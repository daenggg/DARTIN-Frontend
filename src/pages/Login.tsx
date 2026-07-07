import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      
      const sendCodeToBackend = async (kakaoCode: string) => {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/auth/login`,
            { code: kakaoCode },
            { withCredentials: true }
          );
          if (response.status === 200) {
            const { accessToken, user } = response.data;
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
    <div className="fixed inset-0 w-screen h-screen bg-[#f8f7f4] dark:bg-[#121318] font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden box-border flex flex-col justify-between pt-2 pb-6 px-6 transition-colors duration-200">
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
        @keyframes swayLeft {
          0% { transform: translate(-50%, 0) translateX(0); }
          100% { transform: translate(-50%, 0) translateX(-35px); }
        }
        @keyframes swayRight {
          0% { transform: translate(-50%, 0) translateX(0); }
          100% { transform: translate(-50%, 0) translateX(35px); }
        }
      `}</style>

      {/* 1. 백그라운드 태양/달 (구름 사이에서 떠오르는 애니메이션 적용 - 다크모드 대응: 은은하게 빛나는 노란 보름달) */}
      <div
        className="absolute bottom-[-160px] md:bottom-[-200px] left-1/2 w-[480px] md:w-[650px] h-[480px] md:h-[650px] rounded-full bg-gradient-to-b from-rose-200 via-pink-100 to-amber-100/40 dark:from-yellow-100/80 dark:via-amber-300/30 dark:to-transparent blur-xs z-0 pointer-events-none transition-all duration-200"
        style={{
          animation: "riseUp 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      />

      {/* 2. 백그라운드 구름 레이어 (좌우 유영 모션 적용 - 라이트/다크 모두 은은한 화이트 안개구름으로 통일) */}
      {/* 레이어 A (가장 깊은 곳 - 반투명 화이트 구름) */}
      <div
        className="absolute bottom-[-80px] left-1/2 w-[110%] h-[200px] pointer-events-none z-10 opacity-50"
        style={{
          animation: "swayLeft 18s ease-in-out infinite alternate",
        }}
      >
        <div className="absolute left-[15%] w-72 h-72 rounded-full bg-white/40 dark:bg-zinc-950/40 blur-3xl transition-colors duration-200" />
        <div className="absolute left-[45%] w-80 h-80 rounded-full bg-white/50 dark:bg-zinc-950/50 blur-3xl transition-colors duration-200" />
        <div className="absolute left-[70%] w-72 h-72 rounded-full bg-white/45 dark:bg-zinc-950/45 blur-3xl transition-colors duration-200" />
      </div>

      {/* 레이어 B (중간 레이어 - 부드러운 화이트 구름) */}
      <div
        className="absolute bottom-[-60px] left-1/2 w-[110%] h-[180px] pointer-events-none z-20 opacity-75"
        style={{
          animation: "swayRight 22s ease-in-out infinite alternate",
        }}
      >
        <div className="absolute left-[5%] w-80 h-80 rounded-full bg-white/60 dark:bg-zinc-900/40 blur-2xl transition-colors duration-200" />
        <div className="absolute left-[35%] w-96 h-96 rounded-full bg-white/70 dark:bg-zinc-900/50 blur-2xl transition-colors duration-200" />
        <div className="absolute left-[65%] w-80 h-80 rounded-full bg-white/60 dark:bg-zinc-900/40 blur-2xl transition-colors duration-200" />
      </div>

      {/* 레이어 C (가장 전면 - 두꺼운 화이트 구름 베이스) */}
      <div
        className="absolute bottom-[-40px] left-1/2 w-[110%] h-[140px] pointer-events-none z-30 opacity-95"
        style={{
          animation: "swayLeft 14s ease-in-out infinite alternate",
        }}
      >
        <div className="absolute left-[10%] w-72 h-72 rounded-full bg-white/80 dark:bg-zinc-800/50 blur-xl transition-colors duration-200" />
        <div className="absolute left-[40%] w-80 h-80 rounded-full bg-white/90 dark:bg-zinc-800/60 blur-xl transition-colors duration-200" />
        <div className="absolute left-[70%] w-72 h-72 rounded-full bg-white/85 dark:bg-zinc-800/55 blur-xl transition-colors duration-200" />
      </div>

      {/* 상단 네비게이션 헤더 바 */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-3 px-4 md:px-8 z-40 select-none box-border">
        {/* 로고 */}
        <span 
          className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white"
          style={{ color: theme === "dark" ? "#e4e4e7" : "#18181b", fontFamily: '"Nunito", sans-serif' }}
        >
          DARTIN
        </span>

        {/* 테마 토글 버튼 */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="border border-solid border-zinc-200 dark:border-zinc-800 bg-transparent p-1.5 rounded-lg cursor-pointer text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors duration-200"
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
      </header>

      {/* 메인 히어로 컨텐츠 */}
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center flex-1 text-center z-40 px-4 box-border">
        {/* 메인 타이틀 (다크모드 시 백색 폰트 및 광채 효과 추가) */}
        <h1
          className="text-4xl md:text-[54px] font-black tracking-tight dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.22)] leading-[1.12] m-0 select-none transition-colors duration-200"
          style={{ color: theme === "dark" ? "#e4e4e7" : "#18181b" }}
        >
          기업 공시의 핵심 가치,
          <br />
          인공지능으로 떠오르다
        </h1>

        {/* 서브 카피 */}
        <p
          className="text-xs md:text-sm mt-6 max-w-xl leading-relaxed select-none transition-colors duration-200"
          style={{ color: theme === "dark" ? "#d4d4d8" : "#71717a" }}
        >
          흩어져 있던 DART 공시 데이터와 주요 미디어 기사들을 정밀하게 연결하여,
          <br />
          DARTIN AI 모델이 명쾌한 실시간 비즈니스 리포트를 전달합니다.
        </p>

        {/* 액션 버튼 */}
        <div className="mt-9">
          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold py-3.5 px-8 rounded-full text-xs cursor-pointer transition-all duration-150 shadow-md hover:scale-102 select-none border-none shrink-0"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
            >
              <path d="M12 3c-5.523 0-10 3.753-10 8.383 0 2.964 1.83 5.56 4.606 7.15l-1.077 3.978c-.113.418.36.786.725.545l4.67-3.088c.35.048.707.073 1.076.073 5.523 0 10-3.753 10-8.383 0-4.63-4.477-8.383-10-8.383z" />
            </svg>
            카카오 로그인으로 시작하기 &rarr;
          </button>
        </div>
      </main>

      <footer
        className="w-full max-w-6xl mx-auto py-5 px-4 md:px-8 text-center text-[9px] z-40 select-none uppercase tracking-[0.2em] box-border border-t border-solid border-zinc-200/50 dark:border-zinc-900/50 transition-colors duration-200"
        style={{ color: theme === "dark" ? "#71717a" : "#a1a1aa" }}
      >
        Trusted by Enterprises and Investors Nationwide • DARTIN © 2026
      </footer>

      {/* 카카오 토큰 교환 중 로딩 팝업 */}
      {isExchanging && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px] z-50 transition-all duration-200">
          <div className="bg-white dark:bg-[#181920] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3.5 max-w-[240px] w-full text-center box-border">
            {/* 회전식 모던 스피너 */}
            <div className="w-7 h-7 border-[3px] border-solid border-zinc-100 border-t-[#4f46e5] dark:border-zinc-800 dark:border-t-indigo-500 rounded-full animate-spin" />
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
