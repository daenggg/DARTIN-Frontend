import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// 특정 기업 실시간 상세 수집 및 분석 요청 API (SSE 스트리밍 방식)
export const fetchCompanyAnalysisStream = async (
  corpCode: string,
  onEvent: (type: string, data: any) => void
): Promise<void> => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(
    `${BACKEND_URL}/api/company?corp_code=${corpCode}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "text/event-stream",
      },
    }
  );

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("data:")) {
        const rawData = trimmed.substring(5).trim();
        try {
          const parsed = JSON.parse(rawData);
          onEvent(parsed.type, parsed.data);
        } catch (e) {
          console.error("Failed to parse SSE line", trimmed, e);
        }
      }
    }
  }
};

// 입력하신 키워드에 상응하는 상장 기업 후보군 검색 API
export const searchCompanies = async (searchQuery: string) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await axios.get(
    `${BACKEND_URL}/api/company/search`,
    {
      params: { search_query: searchQuery },
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
  return response.data;
};
