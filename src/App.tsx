import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App(): React.JSX.Element {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소: 로그인 화면 및 카카오 인증 처리 */}
        <Route path="/" element={<Login />} />

        {/* 로그인 완료 후 랜딩 페이지 */}
        <Route path="/home" element={<Home />} />

        {/* 엉뚱한 주소 차단: 404 페이지 노출 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
