import React from "react";
import { useNavigate } from "react-router-dom";

const Login = (): React.JSX.Element => {
  const navigate = useNavigate();
  // .env 파일 또는 Vercel 대시보드에 등록한 환경변수
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // 카카오 공식 로그인 창으로 이동할 URL
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = (): void => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleBypassLogin = (): void => {
    localStorage.setItem("accessToken", "dev-bypass-token");
    navigate("/home");
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

      {/* 개발 환경에서만 노출되는 우회 로그인 버튼 */}
      {import.meta.env.DEV && (
        <button
          onClick={handleBypassLogin}
          style={{
            marginTop: "20px",
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "12px 30px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.backgroundColor = "#4338CA")
          }
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.backgroundColor = "#4F46E5")
          }
        >
          [개발자용] 로그인 없이 바로가기
        </button>
      )}
    </div>
  );
};

export default Login;
