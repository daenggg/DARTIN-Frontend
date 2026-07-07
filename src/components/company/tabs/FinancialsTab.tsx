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
  <div className="flex flex-col items-center justify-center py-[120px] px-6 bg-white dark:bg-[#121318] rounded-xl border border-solid border-[#f1f5f9] dark:border-zinc-800 text-[#475569] dark:text-zinc-400 text-center gap-6 font-sans w-full box-border">
    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
      NO FINANCIAL DATA
    </div>

    <div className="flex flex-col gap-2">
      <div className="font-semibold text-[#0f172a] dark:text-zinc-200 text-lg tracking-tight">
        데이터 분석 세션 대기 중
      </div>
      <div className="text-sm leading-relaxed text-[#64748b] dark:text-zinc-400 max-w-[360px] mx-auto">
        실시간 기업 공시 정보, 재무 실적 추이 및 미디어 정보 추출을 시작하려면 좌측 대화창에 분석 대상을 입력해 주십시오.
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
  analysisData,
}) => {
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains("dark")
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
        backgroundColor: isDark
          ? "rgba(241, 245, 249, 0.85)" // Slate 100
          : "rgba(30, 41, 59, 0.85)",   // Slate 800
        hoverBackgroundColor: isDark
          ? "rgba(255, 255, 255, 1)"
          : "rgba(15, 23, 42, 1)",
        borderRadius: 4,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
      {
        label: "영업이익 (조원)",
        data: data.financialData.map((d) => d.profit),
        backgroundColor: isDark
          ? "rgba(245, 158, 11, 0.85)"  // Amber 500
          : "rgba(217, 119, 6, 0.85)",   // Amber 600
        hoverBackgroundColor: isDark
          ? "rgba(251, 191, 36, 1)"
          : "rgba(180, 83, 9, 1)",
        borderRadius: 4,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
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
            family: "'Nunito', 'Outfit', sans-serif",
            size: 11,
            weight: "bold" as const,
          },
          color: isDark ? "#a1a1aa" : "#4b5563",
          usePointStyle: true,
          pointStyle: "circle" as const,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#181920" : "#ffffff",
        titleColor: isDark ? "#f4f4f5" : "#18181b",
        bodyColor: isDark ? "#a1a1aa" : "#4b5563",
        borderColor: isDark ? "#27272a" : "#e2e8f0",
        borderWidth: 1,
        titleFont: {
          family: "'Nunito', 'Outfit', sans-serif",
          size: 12,
          weight: "bold" as const,
        },
        bodyFont: {
          family: "'Nunito', 'Outfit', sans-serif",
          size: 11,
        },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "#71717a" : "#94a3b8",
          font: {
            family: "'Nunito', 'Outfit', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? "rgba(63, 63, 70, 0.25)" : "rgba(226, 232, 240, 0.5)",
        },
        ticks: {
          color: isDark ? "#71717a" : "#94a3b8",
          font: {
            family: "'Nunito', 'Outfit', sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#121318] w-full box-border text-[#18181b] dark:text-[#f4f4f5] text-left flex flex-col font-sans">
      
      {/* 1단계: 상단 실적 추이 차트 및 인원당 실적 분석 (좌우 격자 분할) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full border-b border-solid border-zinc-200 dark:border-zinc-800">
        
        {/* 좌측: 실적 차트 */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between border-solid border-zinc-200 dark:border-zinc-800 lg:border-r max-lg:border-b box-border">
          <div className="text-left">
            <h3 className="m-0 text-lg font-bold text-zinc-950 dark:text-zinc-50">
              {data.fullName} 경영 실적 추이
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 m-0">
              연도별 총 매출액 및 영업이익 변화 추이 (단위: 조원)
            </p>
          </div>

          <div className="flex-1 min-h-[280px] relative mt-4">
            <ReactBar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 우측: 임직원 1인당 영업이익 생산성 분석 */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between box-border">
          <div className="mb-4 text-left">
            <h3 className="m-0 text-lg font-bold text-zinc-950 dark:text-zinc-50">
              임직원 1인당 영업이익 분석
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 m-0">
              총 영업이익 대비 임직원 수 ({data.employeeCount ? `${data.employeeCount.toLocaleString()}명` : "정보 없음"} 기준) 비례 생산성 지표
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center mt-4">
            {data.employeeCount === 0 ? (
              <div className="text-sm text-zinc-400 dark:text-zinc-500 py-6 text-center">
                임직원 수 정보가 누락되어 1인당 생산성 분석이 불가능합니다.
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

                const dotBgClass = isDeficit
                  ? "bg-red-500"
                  : isGood
                    ? "bg-emerald-500"
                    : "bg-amber-500";

                const badgeClass = isDeficit
                  ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                  : isGood
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                    : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";

                const profitFormatted =
                  rawProfit >= 1e12
                    ? `${(rawProfit / 1e12).toFixed(2)}조원`
                    : `${Math.round(rawProfit / 1e8).toLocaleString()}억원`;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-solid border-zinc-100 dark:border-zinc-900 last:border-none text-sm"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {yr}년
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        영업이익: <span className="font-semibold">{profitFormatted}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                          1인당 생산성
                        </span>
                        <span className="text-md font-extrabold text-zinc-950 dark:text-zinc-50">
                          {isDeficit ? "-" : ""}
                          {Math.abs(Math.round(profitPerEmployee / 10000)).toLocaleString()}만원
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold py-0.5 px-2 rounded-full border border-solid flex items-center gap-1.5 w-18 justify-center box-border ${badgeClass}`}
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotBgClass}`} />
                        {isDeficit
                          ? "적자"
                          : isGood
                            ? "우수"
                            : "보통"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 2단계: 하단 요약 재무 테이블 영역 */}
      <div className="p-4 px-6 border-b border-solid border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          FINANCIAL TABLE / 요약 재무제표 현황
        </span>
      </div>

      <div className="p-6 overflow-x-auto w-full box-border">
        <table className="w-full border-collapse text-sm min-w-[500px]">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 border-b border-solid border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest">
              <th className="py-3.5 px-6 font-bold text-left">재무 주요 지표</th>
              {data.years.map((yr) => (
                <th
                  key={yr}
                  className="py-3.5 px-6 font-bold text-right"
                >
                  {yr}년
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-solid border-zinc-100 dark:border-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors duration-150 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 last:border-none"
              >
                <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-100 text-left">
                  {row.label}
                </td>
                {data.years.map((yr) => {
                  const val = row[`y${yr.slice(2)}`] || "-";
                  return (
                    <td
                      key={yr}
                      className="py-4 px-6 text-right font-medium text-zinc-800 dark:text-zinc-200"
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FinancialsTab;
