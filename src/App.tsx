import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소: 로그인 화면 */}
        <Route path="/" element={<Login />} />

        {/* 카카오 리다이렉트 주소: 콜백 화면 연결 */}
        <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />

        {/* 엉뚱한 주소 차단 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
