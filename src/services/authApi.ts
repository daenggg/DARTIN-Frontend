import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// 1. 공용 API 클라이언트 인스턴스 생성 및 내보내기
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // refreshToken 쿠키 공유를 위해 전송 설정 활성화
});

// Request Interceptor: 요청 시 세션스토리지의 accessToken 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 만료 감지 시 자동 토큰 재발급 및 원래 요청 재시도
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 감지 및 무한 루프 방지를 위한 _retry 속성 검사
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Access Token 재발급 API 호출 (/api/auth/refresh)
        const refreshResponse = await axios.post(
          `${BACKEND_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        if (newAccessToken) {
          // 새로 발급받은 액세스 토큰 세션스토리지에 보관
          sessionStorage.setItem("accessToken", newAccessToken);

          // 실패했던 원래 요청의 인증 헤더를 새 토큰으로 갱신하여 재요청
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰이 만료되었거나 에러가 난 경우 모든 세션 비우고 강제 로그아웃
        console.error("Session expired. Redirecting to login...", refreshError);
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 2. 카카오 로그인 인증 토큰 교환 API
export const loginWithKakao = async (code: string) => {
  const response = await apiClient.post(
    "/api/auth/login",
    { code }
  );
  return response.data;
};

// 3. 로그아웃 API
export const logout = async () => {
  await apiClient.post("/api/auth/logout", {});
};
