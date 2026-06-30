import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialsTabProps {
  companyName: string;
  analysisData?: {
    basicInfo?: {
      companyName: string;
      ceo: string;
      address: string;
      industry?: string | null;
      isListed: boolean;
      stockMarket?: string | null;
      establishedYear: string;
      employeeCount?: number | null;
    };
    financialInfo?: Record<
      string,
      {
        revenue: number;
        operatingProfit: number;
        debtRatio: number;
      }
    >;
  };
}

interface FinancialRecord {
  year: string;
  revenue: number;
  profit: number;
}

interface TableRecord {
  label: string;
  [key: string]: string;
}

interface CompanyFinancialData {
  fullName: string;
  employeeCount: number;
  financialData: FinancialRecord[];
  tableData: TableRecord[];
  years: string[];
}

const EmptyState: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "120px 24px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.01), 0 10px 30px rgba(0,0,0,0.02)",
      color: "#475569",
      textAlign: "center",
      gap: "24px",
      fontFamily: "'Inter', sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}
  >
    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: "var(--fs-xs)",
        fontWeight: "600",
        letterSpacing: "1px"
      }}
    >
      FINANCES
    </div>
    
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "var(--fs-lg)", letterSpacing: "-0.01em" }}>
        데이터 분석 세션 대기 중
      </div>
      <div style={{ fontSize: "var(--fs-sm)", lineHeight: "1.6", color: "#64748b", maxWidth: "360px" }}>
        실시간 기업 공시 정보(DART), 재무 실적 추이 및 미디어 정보 추출을 시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
      </div>
    </div>
  </div>
);

const getFinancialData = (analysisData: any): CompanyFinancialData => {
  const finInfo = analysisData.financialInfo || {};
  const sortedYears = Object.keys(finInfo).sort();
  
  const financialData = sortedYears.map((yr) => ({
    year: `${yr}년`,
    revenue: Number((finInfo[yr].revenue / 1e12).toFixed(2)),
    profit: Number((finInfo[yr].operatingProfit / 1e12).toFixed(2)),
  }));

  const tableData = [
    {
      label: "매출액",
      ...sortedYears.reduce((acc, yr) => {
        const val = finInfo[yr].revenue;
        const formatted = val >= 1e12 ? `${(val / 1e12).toFixed(2)}조원` : `${Math.round(val / 1e8).toLocaleString()}억원`;
        return { ...acc, [`y${yr.slice(2)}`]: formatted };
      }, {})
    },
    {
      label: "영업이익",
      ...sortedYears.reduce((acc, yr) => {
        const val = finInfo[yr].operatingProfit;
        const formatted = val >= 1e12 ? `${(val / 1e12).toFixed(2)}조원` : `${Math.round(val / 1e8).toLocaleString()}억원`;
        return { ...acc, [`y${yr.slice(2)}`]: formatted };
      }, {})
    },
    {
      label: "부채비율",
      ...sortedYears.reduce((acc, yr) => ({
        ...acc,
        [`y${yr.slice(2)}`]: `${finInfo[yr].debtRatio}%`
      }), {})
    }
  ];

  return {
    fullName: analysisData.basicInfo?.companyName || "",
    employeeCount: analysisData.basicInfo?.employeeCount || 0,
    financialData,
    tableData,
    years: sortedYears,
  };
};

const FinancialsTab: React.FC<FinancialsTabProps> = ({ companyName, analysisData }) => {
  if (!analysisData || !analysisData.financialInfo || !analysisData.basicInfo) {
    return <EmptyState />;
  }

  const data = getFinancialData(analysisData);

  const chartData = {
    labels: data.financialData.map((d) => d.year),
    datasets: [
      {
        label: "매출액 (조원)",
        data: data.financialData.map((d) => d.revenue),
        backgroundColor: "rgba(99, 102, 241, 0.85)",
        hoverBackgroundColor: "rgba(99, 102, 241, 1)",
        borderRadius: 6,
        barPercentage: 0.85,
        categoryPercentage: 0.85,
      },
      {
        label: "영업이익 (조원)",
        data: data.financialData.map((d) => d.profit),
        backgroundColor: "rgba(20, 184, 166, 0.85)",
        hoverBackgroundColor: "rgba(20, 184, 166, 1)",
        borderRadius: 6,
        barPercentage: 0.85,
        categoryPercentage: 0.85,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: "#71717a",
        },
      },
      tooltip: {
        bodyFont: {
          family: "'Inter', sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#71717a",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "#f4f4f5",
        },
        ticks: {
          color: "#71717a",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", width: "100%" }}>
        {/* 차트 카드 */}
        <div
          style={{
            flex: "1.2 1 340px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "24px",
            border: "1px solid #e4e4e7",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ textAlign: "left" }}>
              <h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 700, color: "#18181b" }}>
                {data.fullName} 경영 실적 추이
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "var(--fs-xs)", color: "#71717a" }}>
                연도별 총 매출액 및 영업이익 변화 추이
              </p>
            </div>
            <span style={{ fontSize: "var(--fs-xs)", color: "#a1a1aa", backgroundColor: "#f4f4f5", padding: "2px 8px", borderRadius: "4px" }}>
              단위: 조원
            </span>
          </div>

          <div style={{ flex: 1, minHeight: "280px", position: "relative" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 1인당 영업이익 분석 섹션 */}
        <div
          style={{
            flex: "1 1 300px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "24px",
            border: "1px solid #e4e4e7",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: "16px", textAlign: "left" }}>
            <h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 700, color: "#18181b" }}>
              임직원 1인당 영업이익 분석
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "var(--fs-xs)", color: "#71717a" }}>
              총 영업이익 대비 임직원 수 ({data.employeeCount ? `${data.employeeCount.toLocaleString()}명` : "정보 없음"} 기준) 비례 분석
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, justifyContent: "center" }}>
            {data.employeeCount === 0 ? (
              <div style={{ fontSize: "var(--fs-sm)", color: "#71717a", padding: "24px 0", textAlign: "center" }}>
                임직원 수 정보가 제공되지 않아 1인당 생산성 지표 분석이 불가능합니다.
              </div>
            ) : (
              data.years.map((yr, idx) => {
                const rawProfit = (analysisData.financialInfo || {})[yr]?.operatingProfit || 0;
                const profitPerEmployee = Math.round(rawProfit / data.employeeCount);
                const isGood = profitPerEmployee > 200000000;
                const isDeficit = rawProfit < 0;

                const borderLeftColor = isDeficit ? "#f87171" : isGood ? "#34d399" : "#fbbf24";
                const dotColor = isDeficit ? "#ef4444" : isGood ? "#10b981" : "#f59e0b";
                const bgColor = isDeficit ? "rgba(239, 68, 68, 0.02)" : isGood ? "rgba(16, 185, 129, 0.02)" : "rgba(245, 158, 11, 0.02)";
                const hoverBgColor = isDeficit ? "rgba(239, 68, 68, 0.05)" : isGood ? "rgba(16, 185, 129, 0.05)" : "rgba(245, 158, 11, 0.05)";

                const profitFormatted = rawProfit >= 1e12 ? `${(rawProfit / 1e12).toFixed(2)}조원` : `${Math.round(rawProfit / 1e8).toLocaleString()}억원`;

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderRadius: "6px",
                      backgroundColor: bgColor,
                      border: "1px solid #f3f4f6",
                      borderLeft: `4px solid ${borderLeftColor}`,
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = borderLeftColor;
                      e.currentTarget.style.backgroundColor = hoverBgColor;
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#f3f4f6";
                      e.currentTarget.style.backgroundColor = bgColor;
                      e.currentTarget.style.transform = "translateX(0px)";
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "var(--fs-md)", fontWeight: "700", color: "#111827" }}>
                        {yr}년
                      </span>
                      <span style={{ fontSize: "var(--fs-xs)", color: "#6b7280", marginTop: "4px" }}>
                        영업이익: <span style={{ fontWeight: "600", color: isDeficit ? "#ef4444" : "#374151" }}>{profitFormatted}</span>
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "var(--fs-xs)", color: "#6b7280", display: "block", marginBottom: "2px" }}>
                          1인당 생산성
                        </span>
                        <span style={{ fontSize: "var(--fs-lg)", fontWeight: "800", color: isDeficit ? "#ef4444" : "#111827" }}>
                          {isDeficit ? "-" : ""}{Math.abs(Math.round(profitPerEmployee / 10000)).toLocaleString()}만원
                        </span>
                      </div>
                      
                      <span
                        style={{
                          fontSize: "var(--fs-xs)",
                          fontWeight: "700",
                          padding: "4px 10px",
                          borderRadius: "100px",
                          border: "1px solid",
                          backgroundColor: isDeficit ? "#fef2f2" : isGood ? "#ecfdf5" : "#fffbeb",
                          color: isDeficit ? "#ef4444" : isGood ? "#10b981" : "#f59e0b",
                          borderColor: isDeficit ? "#fecaca" : isGood ? "#a7f3d0" : "#fef3c7",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          width: "80px",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: dotColor }}></span>
                        {isDeficit ? "적자/불황" : isGood ? "성과 우수" : "평균 보통"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 요약 재무 테이블 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #e4e4e7",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 700, color: "#18181b" }}>
            주요 요약 재무상태표 현황
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "var(--fs-xs)", color: "#71717a" }}>
            과거 3개년 경영 실적 성과 및 예상 지표 세부 요약표
          </p>
        </div>

        <div style={{ overflowX: "auto", width: "100%", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-sm)", minWidth: "500px" }}>
            <thead>
              <tr style={{ color: "#374151", backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: "14px 18px", fontWeight: "700", textAlign: "left" }}>재무 지표</th>
                {data.years.map((yr, yIdx) => {
                  const isLast = yIdx === data.years.length - 1;
                  return (
                    <th
                      key={yr}
                      style={{
                        padding: "14px 18px",
                        fontWeight: isLast ? "700" : "600",
                        color: isLast ? "#4f46e5" : "#374151",
                        backgroundColor: isLast ? "rgba(99, 102, 241, 0.05)" : "transparent",
                        textAlign: "center"
                      }}
                    >
                      {yr}년
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.tableData.map((row, idx) => {
                let rowIcon = "🔹";
                if (row.label.includes("비율")) rowIcon = "📊";

                const isEven = idx % 2 === 0;
                const defaultRowColor = isEven ? "#ffffff" : "#fdfdfd";

                return (
                  <tr 
                    key={idx} 
                    style={{ 
                      borderBottom: "1px solid #f3f4f6", 
                      color: "#1f2937",
                      backgroundColor: defaultRowColor,
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f4f4f5";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = defaultRowColor;
                    }}
                  >
                    <td style={{ padding: "14px 18px", fontWeight: "600", color: "#374151", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "var(--fs-lg)" }}>{rowIcon}</span>
                      {row.label}
                    </td>
                    {data.years.map((yr, yIdx) => {
                      const val = row[`y${yr.slice(2)}`] || "-";
                      const isLast = yIdx === data.years.length - 1;
                      return (
                        <td
                          key={yr}
                          style={{
                            padding: "14px 18px",
                            textAlign: "center",
                            fontWeight: isLast ? "800" : "500",
                            color: isLast ? "#4f46e5" : "#4b5563",
                            backgroundColor: isLast ? "rgba(99, 102, 241, 0.02)" : "transparent"
                          }}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab;
