import axios from "axios";

export interface CompanyBasicInfo {
  companyName: string;
  ceo: string;
  address: string;
  industry?: string;
  isListed: boolean;
  stockMarket?: string;
  establishedYear: string;
  employeeCount?: number;
}

export interface FinancialYearInfo {
  revenue: number;
  operatingProfit: number;
  debtRatio: number;
}

export type FinancialInfoMap = Record<string, FinancialYearInfo>;

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
}

export interface JobLinks {
  saramin: string;
  wanted: string;
  work24: string;
}

export interface SessionData {
  sessionId: string;
}

export interface CompanyAnalysisResponse {
  basicInfo: CompanyBasicInfo;
  financialInfo: FinancialInfoMap;
  news: NewsItem[];
  aiAnalysis: string;
  jobLinks: JobLinks;
  session: SessionData;
}

// GET /api/company
export const fetchCompanyAnalysis = async (
  corpCode: string
): Promise<CompanyAnalysisResponse> => {
  const token = sessionStorage.getItem("accessToken");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
  const url = `${BACKEND_URL}/api/company?corp_code=${corpCode}`;

  console.log("fetchCompanyAnalysis - Initiating request to URL:", url);

  const response = await axios.get<CompanyAnalysisResponse>(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    }
  });

  return response.data;
};
