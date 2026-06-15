import React from "react";

const Login = (): React.JSX.Element => {
  // .env 파일 또는 Vercel 대시보드에 등록한 환경변수
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // 카카오 공식 로그인 창으로 이동할 URL
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  console.log("현재 내 컴퓨터가 읽은 카카오 키:", REST_API_KEY);

  const handleKakaoLogin = (): void => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "150px",
      }}
    >
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Go-West 서비스</h2>

      {/* 테스트할 로그인 버튼 */}
      <button
        onClick={handleKakaoLogin}
        style={{
          backgroundColor: "#FEE500",
          color: "#191919",
          border: "none",
          borderRadius: "12px",
          padding: "15px 40px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
          (e.currentTarget.style.backgroundColor = "#FADA0A")
        }
        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
          (e.currentTarget.style.backgroundColor = "#FEE500")
        }
      >
        카카오계정으로 로그인
      </button>
    </div>
  );
};

export default Login;
