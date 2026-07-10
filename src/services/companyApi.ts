import axios from "axios";
import { type CompanyAnalysisResponse } from "../types/index";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// 특정 기업 실시간 상세 수집 및 분석 요청 API
export const fetchCompanyAnalysis = async (
  corpCode: string
): Promise<CompanyAnalysisResponse> => {
  const token = sessionStorage.getItem("accessToken");
  const response = await axios.get<CompanyAnalysisResponse>(
    `${BACKEND_URL}/api/company?corp_code=${corpCode}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      }
    }
  );
  return response.data;
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
