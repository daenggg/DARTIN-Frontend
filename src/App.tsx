import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소: 로그인 화면 */}
        <Route path="/" element={<Login />} />

        {/* 카카오 리다이렉트 주소: 콜백 화면 연결 */}
        <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />

        {/* 로그인 완료 후 랜딩 페이지 */}
        <Route path="/home" element={<Home />} />

        {/* 엉뚱한 주소 차단: 404 페이지 노출 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
