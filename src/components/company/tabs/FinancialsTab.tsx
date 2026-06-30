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
import { Bar as ReactBar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white rounded-xl border border-solid border-[#f1f5f9] shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_30px_rgba(0,0,0,0.02)] text-[#475569] text-center gap-6 font-sans w-full box-border">
    <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-solid border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-xs font-semibold tracking-wider">
      FINANCES
    </div>

    <div className="flex flex-col gap-2">
      <div className="font-semibold text-[#0f172a] text-lg tracking-tight">
        데이터 분석 세션 대기 중
      </div>
      <div className="text-sm leading-relaxed text-[#64748b] max-w-[360px] mx-auto">
        실시간 기업 공시 정보(DART), 재무 실적 추이 및 미디어 정보 추출을
        시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
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
        const formatted =
          val >= 1e12
            ? `${(val / 1e12).toFixed(2)}조원`
            : `${Math.round(val / 1e8).toLocaleString()}억원`;
        return { ...acc, [`y${yr.slice(2)}`]: formatted };
      }, {}),
    },
    {
      label: "영업이익",
      ...sortedYears.reduce((acc, yr) => {
        const val = finInfo[yr].operatingProfit;
        const formatted =
          val >= 1e12
            ? `${(val / 1e12).toFixed(2)}조원`
            : `${Math.round(val / 1e8).toLocaleString()}억원`;
        return { ...acc, [`y${yr.slice(2)}`]: formatted };
      }, {}),
    },
    {
      label: "부채비율",
      ...sortedYears.reduce(
        (acc, yr) => ({
          ...acc,
          [`y${yr.slice(2)}`]: `${finInfo[yr].debtRatio}%`,
        }),
        {},
      ),
    },
  ];

  return {
    fullName: analysisData.basicInfo?.companyName || "",
    employeeCount: analysisData.basicInfo?.employeeCount || 0,
    financialData,
    tableData,
    years: sortedYears,
  };
};

const FinancialsTab: React.FC<FinancialsTabProps> = ({
  companyName,
  analysisData,
}) => {
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
    <div className="flex flex-col gap-6 font-sans w-full box-border">
      <div className="flex gap-6 flex-wrap w-full">
        {/* 차트 카드 */}
        <div className="flex-[1.2] min-w-[340px] bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] box-border flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-left">
              <h3 className="m-0 text-lg font-bold text-[#18181b]">
                {data.fullName} 경영 실적 추이
              </h3>
              <p className="mt-1 text-xs text-[#71717a] m-0">
                연도별 총 매출액 및 영업이익 변화 추이
              </p>
            </div>
            <span className="text-xs text-[#a1a1aa] bg-[#f4f4f5] py-0.5 px-2 rounded">
              단위: 조원
            </span>
          </div>

          <div className="flex-1 min-h-[280px] relative">
            <ReactBar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 1인당 영업이익 분석 섹션 */}
        <div className="flex-1 min-w-[300px] bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] flex flex-col box-border">
          <div className="mb-4 text-left">
            <h3 className="m-0 text-lg font-bold text-[#18181b]">
              임직원 1인당 영업이익 분석
            </h3>
            <p className="mt-1 text-xs text-[#71717a] m-0">
              총 영업이익 대비 임직원 수 (
              {data.employeeCount
                ? `${data.employeeCount.toLocaleString()}명`
                : "정보 없음"}{" "}
              기준) 비례 분석
            </p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {data.employeeCount === 0 ? (
              <div className="text-sm text-[#71717a] py-6 text-center">
                임직원 수 정보가 제공되지 않아 1인당 생산성 지표 분석이
                불가능합니다.
              </div>
            ) : (
              data.years.map((yr, idx) => {
                const rawProfit =
                  (analysisData.financialInfo || {})[yr]?.operatingProfit || 0;
                const profitPerEmployee = Math.round(
                  rawProfit / data.employeeCount,
                );
                const isGood = profitPerEmployee > 200000000;
                const isDeficit = rawProfit < 0;

                const borderLeftClass = isDeficit
                  ? "border-l-[#f87171]"
                  : isGood
                    ? "border-l-[#34d399]"
                    : "border-l-[#fbbf24]";
                const dotBgClass = isDeficit
                  ? "bg-[#ef4444]"
                  : isGood
                    ? "bg-[#10b981]"
                    : "bg-[#f59e0b]";
                const bgClass = isDeficit
                  ? "bg-[rgba(239,68,68,0.02)] hover:bg-[rgba(239,68,68,0.05)]"
                  : isGood
                    ? "bg-[rgba(16,185,129,0.02)] hover:bg-[rgba(16,185,129,0.05)]"
                    : "bg-[rgba(245,158,11,0.02)] hover:bg-[rgba(245,158,11,0.05)]";

                const badgeClass = isDeficit
                  ? "bg-[#fef2f2] text-[#ef4444] border-[#fecaca]"
                  : isGood
                    ? "bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]"
                    : "bg-[#fffbeb] text-[#f59e0b] border-[#fef3c7]";

                const profitFormatted =
                  rawProfit >= 1e12
                    ? `${(rawProfit / 1e12).toFixed(2)}조원`
                    : `${Math.round(rawProfit / 1e8).toLocaleString()}억원`;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-3.5 px-5 rounded border border-solid border-[#f3f4f6] border-l-4 ${borderLeftClass} ${bgClass} transition-all duration-200 hover:translate-x-0.5`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-md font-bold text-[#111827]">
                        {yr}년
                      </span>
                      <span className="text-xs text-[#6b7280] mt-1">
                        영업이익:{" "}
                        <span
                          className={
                            isDeficit
                              ? "text-[#ef4444] font-semibold"
                              : "text-[#374151] font-semibold"
                          }
                        >
                          {profitFormatted}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-[#6b7280] block mb-0.5">
                          1인당 생산성
                        </span>
                        <span
                          className={`text-lg font-extrabold ${isDeficit ? "text-[#ef4444]" : "text-[#111827]"}`}
                        >
                          {isDeficit ? "-" : ""}
                          {Math.abs(
                            Math.round(profitPerEmployee / 10000),
                          ).toLocaleString()}
                          만원
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold py-1 px-2.5 rounded-full border border-solid flex items-center gap-1.5 w-20 justify-center box-border ${badgeClass}`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${dotBgClass}`}
                        ></span>
                        {isDeficit
                          ? "적자/불황"
                          : isGood
                            ? "성과 우수"
                            : "평균 보통"}
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
      <div className="bg-white rounded-lg p-6 border border-solid border-[#e4e4e7] shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] w-full box-border">
        <div className="mb-5 text-left">
          <h3 className="m-0 text-lg font-bold text-[#18181b]">
            주요 요약 재무상태표 현황
          </h3>
          <p className="mt-1 text-xs text-[#71717a] m-0">
            과거 3개년 경영 실적 성과 및 예상 지표 세부 요약표
          </p>
        </div>

        <div className="overflow-x-auto w-full rounded-lg border border-solid border-[#f3f4f6]">
          <table className="w-full border-collapse text-sm min-w-[500px]">
            <thead>
              <tr className="text-[#374151] bg-[#f9fafb] border-b-2 border-solid border-[#e5e7eb]">
                <th className="py-3.5 px-4.5 font-bold text-left">재무 지표</th>
                {data.years.map((yr, yIdx) => {
                  const isLast = yIdx === data.years.length - 1;
                  return (
                    <th
                      key={yr}
                      className={`py-3.5 px-4.5 font-bold text-center ${isLast ? "text-[#4f46e5] bg-[rgba(99,102,241,0.05)]" : ""}`}
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
                const defaultRowBg = isEven ? "bg-white" : "bg-[#fdfdfd]";

                return (
                  <tr
                    key={idx}
                    className={`border-b border-solid border-[#f3f4f6] text-[#1f2937] ${defaultRowBg} transition-colors duration-150 hover:bg-slate-50`}
                  >
                    <td className="py-3.5 px-4.5 font-semibold text-[#374151] flex items-center gap-2">
                      <span className="text-lg">{rowIcon}</span>
                      {row.label}
                    </td>
                    {data.years.map((yr, yIdx) => {
                      const val = row[`y${yr.slice(2)}`] || "-";
                      const isLast = yIdx === data.years.length - 1;
                      return (
                        <td
                          key={yr}
                          className={`py-3.5 px-4.5 text-center ${isLast ? "font-extrabold text-[#4f46e5] bg-[rgba(99,102,241,0.02)]" : "font-semibold text-[#4b5563]"}`}
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
