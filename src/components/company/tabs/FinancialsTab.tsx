import React, { useState, useEffect } from "react";
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
  theme: "light" | "dark";
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
    className="flex flex-col items-center justify-center py-[120px] px-6 rounded-xl border border-solid text-center gap-6 font-sans w-full box-border"
    style={{
      background: "var(--bg-panel)",
      borderColor: "var(--border)",
      color: "var(--text)",
    }}
  >
    <div
      className="text-xs font-bold uppercase tracking-wider"
      style={{ color: "var(--text)" }}
    >
      NO FINANCIAL DATA
    </div>

    <div className="flex flex-col gap-2">
      <div
        className="font-semibold text-lg tracking-tight"
        style={{ color: "var(--text-h)" }}
      >
        데이터 분석 세션 대기 중
      </div>
      <div
        className="text-sm leading-relaxed max-w-[360px] mx-auto"
        style={{ color: "var(--text)" }}
      >
        실시간 기업 공시 정보, 재무 실적 추이 및 미디어 정보 추출을 시작하려면
        좌측 대화창에 분석 대상을 입력해 주십시오.
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
      ...sortedYears.reduce((acc, yr) => {
        return { ...acc, [`y${yr.slice(2)}`]: `${finInfo[yr].debtRatio}%` };
      }, {}),
    },
  ];

  return {
    fullName: analysisData.basicInfo?.companyName || "해당 기업",
    employeeCount: analysisData.basicInfo?.employeeCount || 0,
    financialData,
    tableData,
    years: sortedYears,
  };
};

const SkeletonBlock: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = "", style }) => (
  <div className={`skeleton-shimmer rounded ${className}`} style={style} />
);

const FinancialsTab: React.FC<FinancialsTabProps> = ({
  analysisData,
  theme,
}) => {
  if (!analysisData) {
    return <EmptyState />;
  }

  const isStreaming = analysisData.financialInfo === undefined;
  const hasFinancialData =
    analysisData.financialInfo !== undefined &&
    Object.keys(analysisData.financialInfo).length > 0;

  const data = hasFinancialData
    ? getFinancialData(analysisData)
    : {
        fullName: analysisData.basicInfo?.companyName || "해당 기업",
        employeeCount: analysisData.basicInfo?.employeeCount || 0,
        financialData: [],
        tableData: [],
        years: [],
      };

  const [chartColors, setChartColors] = useState({
    revenue: "#d4543d",
    profit: "#4c483d",
    legend: "#1c1b1a",
    ticks: "#2c2b2a",
    grid: "rgba(0, 0, 0, 0.05)",
  });

  useEffect(() => {
    if (!hasFinancialData) return;
    const style = getComputedStyle(document.documentElement);
    setChartColors({
      revenue: style.getPropertyValue("--chart-revenue").trim() || "#d4543d",
      profit: style.getPropertyValue("--chart-profit").trim() || "#4c483d",
      legend: style.getPropertyValue("--chart-text-legend").trim() || "#1c1b1a",
      ticks: style.getPropertyValue("--chart-text-ticks").trim() || "#2c2b2a",
      grid:
        style.getPropertyValue("--chart-grid").trim() || "rgba(0, 0, 0, 0.05)",
    });
  }, [theme, analysisData, hasFinancialData]);

  const isDark = theme === "dark";

  const chartData = {
    labels: data.financialData.map((d) => d.year),
    datasets: [
      {
        label: "매출액 (조원)",
        data: data.financialData.map((d) => d.revenue),
        backgroundColor: chartColors.revenue,
        borderRadius: 4,
      },
      {
        label: "영업이익 (조원)",
        data: data.financialData.map((d) => d.profit),
        backgroundColor: chartColors.profit,
        borderRadius: 4,
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
          color: chartColors.legend,
          font: {
            family: "'Nunito', 'Outfit', sans-serif",
            size: 11,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.ticks,
          font: {
            family: "'Nunito', 'Outfit', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          color: chartColors.ticks,
          font: {
            family: "'Nunito', 'Outfit', sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div
      className="border border-solid rounded-2xl overflow-hidden w-full box-border text-left flex flex-col font-sans"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-panel)",
        color: "var(--text)",
      }}
    >
      {/* 1단계: 상단 실적 추이 차트 및 인원당 실적 분석 (좌우 격자 분할) */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 w-full border-b border-solid"
        style={{ borderBottomColor: "var(--border)" }}
      >
        {/* 좌측: 실적 차트 */}
        <div
          className="lg:col-span-6 p-6 flex flex-col justify-between border-solid lg:border-r max-lg:border-b box-border min-h-[380px]"
          style={{
            borderRightColor: "var(--border)",
            borderBottomColor: "var(--border)",
          }}
        >
          <div className="text-left">
            <h3
              className="m-0 text-lg font-bold"
              style={{ color: "var(--text-h)" }}
            >
              {data.fullName} 경영 실적 추이
            </h3>
            <p className="mt-1 text-xs m-0" style={{ color: "var(--text)" }}>
              연도별 총 매출액 및 영업이익 변화 추이 (단위: 조원)
            </p>
          </div>

          <div className="flex-1 min-h-[280px] relative mt-4 flex items-center justify-center">
            {hasFinancialData ? (
              <ReactBar
                key={isDark ? "dark" : "light"}
                data={chartData}
                options={chartOptions}
              />
            ) : isStreaming ? (
              <div
                className="flex flex-col items-center gap-3 w-full h-[240px] justify-center border border-dashed rounded-lg p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-xs font-semibold animate-pulse"
                  style={{ color: "var(--text)" }}
                >
                  재무 데이터 실시간 추출 중...
                </span>
                <div className="flex gap-4 items-end w-full h-[150px] justify-center mt-2">
                  <SkeletonBlock style={{ width: "35px", height: "80px" }} />
                  <SkeletonBlock style={{ width: "35px", height: "30px" }} />
                  <SkeletonBlock style={{ width: "35px", height: "120px" }} />
                  <SkeletonBlock style={{ width: "35px", height: "45px" }} />
                  <SkeletonBlock style={{ width: "35px", height: "140px" }} />
                  <SkeletonBlock style={{ width: "35px", height: "60px" }} />
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center gap-2.5 w-full h-[240px] justify-center border border-dashed rounded-lg p-6"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg)",
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-h)" }}
                >
                  공시된 재무제표 정보가 확인되지 않습니다
                </span>
                <span
                  className="text-[10px] text-center max-w-[280px] leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  DART에 최근 3개년 보고서가 등록되지 않은 소규모 기업 또는
                  비상장사 등의 경우 재무 조회가 제한될 수 있습니다.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 우측: 임직원 1인당 영업이익 생산성 분석 */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between box-border min-h-[380px]">
          <div className="mb-4 text-left">
            <h3
              className="m-0 text-lg font-bold"
              style={{ color: "var(--text-h)" }}
            >
              임직원 1인당 영업이익 분석
            </h3>
            <p className="mt-1 text-xs m-0" style={{ color: "var(--text)" }}>
              총 영업이익 대비 임직원 수 (
              {data.employeeCount
                ? `${data.employeeCount.toLocaleString()}명`
                : "정보 없음"}{" "}
              기준) 비례 생산성 지표
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center mt-4">
            {isStreaming ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-solid last:border-none text-sm"
                  style={{ borderBottomColor: "var(--border)" }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <SkeletonBlock style={{ width: "50px", height: "14px" }} />
                    <SkeletonBlock style={{ width: "130px", height: "10px" }} />
                  </div>
                  <SkeletonBlock style={{ width: "80px", height: "24px" }} />
                </div>
              ))
            ) : !hasFinancialData ? (
              <div
                className="text-xs py-12 text-center leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                조회된 연도별 영업이익 수치가 부재하여
                <br />
                1인당 생산성 지표를 산출할 수 없습니다.
              </div>
            ) : data.employeeCount === 0 ? (
              <div
                className="text-sm py-6 text-center"
                style={{ color: "var(--text)" }}
              >
                임직원 수 정보가 누락되어 1인당 생산성 분석이 불가능합니다.
              </div>
            ) : (
              data.years.map((yr, idx) => {
                const rawProfit =
                  (analysisData.financialInfo || {})[yr]?.operatingProfit || 0;
                const profitPerEmployee = Math.round(
                  rawProfit / data.employeeCount,
                );
                const isDeficit = rawProfit < 0;
                const profitFormatted =
                  rawProfit >= 1e12
                    ? `${(rawProfit / 1e12).toFixed(2)}조원`
                    : `${Math.round(rawProfit / 1e8).toLocaleString()}억원`;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-solid last:border-none text-sm"
                    style={{ borderBottomColor: "var(--border)" }}
                  >
                    <div className="flex flex-col items-start">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--text-h)" }}
                      >
                        {yr}년
                      </span>
                      <span
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text)" }}
                      >
                        영업이익:{" "}
                        <span className="font-semibold">{profitFormatted}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className="text-[10px] block"
                          style={{ color: "var(--text)" }}
                        >
                          1인당 생산성
                        </span>
                        <span
                          className="text-md font-extrabold"
                          style={{ color: "var(--text-h)" }}
                        >
                          {isDeficit ? "-" : ""}
                          {Math.abs(
                            Math.round(profitPerEmployee / 10000),
                          ).toLocaleString()}
                          만원
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 2단계: 하단 요약 재무 테이블 영역 */}
      <div
        className="p-2.5 px-5 border-b border-solid flex items-center justify-between shrink-0"
        style={{ borderBottomColor: "var(--border)", background: "var(--bg)" }}
      >
        <span
          className="text-xs md:text-sm font-extrabold uppercase tracking-wider"
          style={{ color: "var(--text-h)" }}
        >
          FINANCIAL TABLE / 요약 재무제표 현황
        </span>
      </div>

      <div className="p-4 px-6 overflow-x-auto w-full box-border">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr
              className="border-b-2 border-solid text-xs font-extrabold uppercase tracking-wider"
              style={{
                borderBottomColor: "var(--border)",
                color: "var(--text-h)",
              }}
            >
              <th className="py-3 px-4 text-left">재무 주요 지표</th>
              {hasFinancialData
                ? data.years.map((yr) => (
                    <th key={yr} className="py-3 px-4 text-right">
                      {yr}년
                    </th>
                  ))
                : ["-3개년", "-2개년", "-1개년"].map((yr) => (
                    <th key={yr} className="py-3 px-4 text-right opacity-40">
                      {yr}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {hasFinancialData ? (
              data.tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-solid transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                  style={{ borderBottomColor: "var(--border)" }}
                >
                  <td
                    className="py-2.5 px-4 text-xs font-bold text-left"
                    style={{ color: "var(--text-h)" }}
                  >
                    {row.label}
                  </td>
                  {data.years.map((yr) => {
                    const val = row[`y${yr.slice(2)}`] || "-";
                    return (
                      <td
                        key={yr}
                        className="py-2.5 px-4 text-right text-xs font-semibold font-mono"
                        style={{ color: "var(--text)" }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : isStreaming ? (
              ["매출액", "영업이익", "부채비율"].map((label, idx) => (
                <tr
                  key={idx}
                  className="border-b border-solid"
                  style={{ borderBottomColor: "var(--border)" }}
                >
                  <td
                    className="py-3 px-4 text-xs font-bold text-left"
                    style={{ color: "var(--text-h)" }}
                  >
                    {label}
                  </td>
                  {[1, 2, 3].map((i) => (
                    <td key={i} className="py-3 px-4 text-right">
                      <div className="flex justify-end">
                        <SkeletonBlock
                          style={{ width: "80px", height: "12px" }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-xs"
                  style={{ color: "var(--text)" }}
                >
                  조회된 요약 재무 테이블 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialsTab;
