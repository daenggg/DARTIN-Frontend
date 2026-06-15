import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UserInfo {
  id: string;
  nickname: string;
  profileImage: string | null;
}

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("accessToken");

    if (!storedUser || !token) {
      // 로그인 정보가 없으면 로그인 페이지로 보냄
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("사용자 정보 파싱 실패:", e);
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃 처리 중 오류가 발생했으나 세션을 정리합니다.");
    } finally {
      // 에러 여부와 관계없이 프론트 세션 비우고 로그인 화면 이동
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
        <p style={{ color: "#999" }}>로딩 중...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "120px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333", fontWeight: 600 }}>
          Go-West 홈
        </h2>

        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필 이미지"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "15px",
              border: "3px solid #f0f0f0",
            }}
          />
        ) : (
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px auto",
              fontSize: "14px",
              color: "#666",
            }}
          >
            이미지 없음
          </div>
        )}

        <h3 style={{ margin: "5px 0", color: "#222", fontSize: "20px" }}>
          {user.nickname}님
        </h3>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "30px" }}>
          고유 ID: {user.id}
        </p>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: "#ff4d4f",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 0",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(255, 77, 79, 0.2)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.backgroundColor = "#ff7875")
          }
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.backgroundColor = "#ff4d4f")
          }
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Home;
