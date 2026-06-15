import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = (): React.JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // .env 파일에 적어둔 백엔드 주소
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const sendCodeToBackend = async (kakaoCode: string) => {
      try {
        // '/api/auth/login'
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/login`,
          { code: kakaoCode },
          { withCredentials: true },
        );

        if (response.status === 200) {
          const { accessToken, user } = response.data;
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("user", JSON.stringify(user));
          alert(`${user.nickname}님, 환영합니다!`);
          navigate("/home");
        }
      } catch (error) {
        console.error("백엔드 통신 에러:", error);
        alert("로그인 처리 중 서버 오류가 발생했습니다.");
        navigate("/");
      }
    };

    if (code) {
      sendCodeToBackend(code);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "150px",
      }}
    >
      <h3 style={{ color: "#666" }}>카카오 로그인 처리 중입니다...</h3>
      <p style={{ color: "#999", fontSize: "14px" }}>잠시만 기다려 주세요.</p>
    </div>
  );
};

export default KakaoCallback;
