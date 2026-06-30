import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fcfcfc",
        fontFamily: "'Inter', sans-serif",
        color: "#18181b",
        padding: "24px",
        boxSizing: "border-box",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          fontSize: "120px",
          fontWeight: 900,
          color: "#000000",
          marginBottom: "20px",
          opacity: 0.5,
          letterSpacing: "5px",
          lineHeight: 1,
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#0f172a",
          margin: "0 0 12px 0",
          letterSpacing: "-0.02em"
        }}
      >
        요청하신 페이지를 찾을 수 없습니다
      </h1>

      <p
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#64748b",
          maxWidth: "400px",
          textAlign: "center",
          margin: "0 0 32px 0"
        }}
      >
        존재하지 않거나 삭제된 경로입니다. 입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
      </p>

      <button
        onClick={() => navigate("/home")}
        style={{
          padding: "12px 24px",
          backgroundColor: "#18181b",
          color: "#ffffff",
          border: "none",
          borderRadius: "100px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#18181b")}
      >
        홈 화면으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
