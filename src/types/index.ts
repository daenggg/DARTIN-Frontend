export interface CompanyBasicInfo {
  companyName: string;
  ceo: string;
  address: string;
  industry?: string | null;
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

export interface Message {
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
  isStatus?: boolean;
  candidates?: Array<{ corp_name: string; corp_code: string }>;
  isLoginError?: boolean;
}

export interface ChatSession {
  sessionId: string;
  companyName: string;
  updatedAt: string;
  isPinned: boolean;
  pinnedAt?: string | null;
  isDeleting?: boolean;
}
