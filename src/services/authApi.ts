import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// 카카오 로그인 인증 토큰 교환 API
export const loginWithKakao = async (code: string) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/auth/login`,
    { code },
    { withCredentials: true }
  );
  return response.data;
};

// 로그아웃 API
export const logout = async () => {
  const token = sessionStorage.getItem("accessToken");
  await axios.post(
    `${BACKEND_URL}/api/auth/logout`,
    {},
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true,
    }
  );
};
