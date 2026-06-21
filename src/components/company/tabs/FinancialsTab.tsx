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

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FinancialsTab: React.FC = () => {
  // 임직원 수: SK하이닉스 32,125명 가정
  const employeeCount = 32125;

  const financialData = [
    { year: "2021년", revenue: 42.9, profit: 12.4 },
    { year: "2022년", revenue: 44.6, profit: 6.8 },
    { year: "2023년", revenue: 32.7, profit: -7.7 },
    { year: "2024년 (예상)", revenue: 52.1, profit: 16.2 },
  ];

  // Chart.js 데이터 설정
  const chartData = {
    labels: financialData.map((d) => d.year),
    datasets: [
      {
        label: "매출액 (조원)",
        data: financialData.map((d) => d.revenue),
        backgroundColor: "rgba(99, 102, 241, 0.85)", // 세련되고 밝은 인디고
        hoverBackgroundColor: "rgba(99, 102, 241, 1)",
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: "영업이익 (조원)",
        data: financialData.map((d) => d.profit),
        backgroundColor: "rgba(20, 184, 166, 0.85)", // 산뜻한 민트/테일
        hoverBackgroundColor: "rgba(20, 184, 166, 1)",
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'Inter', sans-serif" }}>
      {/* 2컬럼 레이아웃: 차트 & 분석 정보 */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        {/* 매출액 & 영업이익 추이 차트 카드 (좌측 정렬) */}
        <div
          style={{
            flex: 1.2,
            minWidth: "320px",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "20px 24px",
            border: "1px solid #e4e4e7",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 700, color: "#18181b" }}>
            매출액 및 영업이익 추이 (단위: 조원)
          </h3>
          <div style={{ height: "240px", position: "relative" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 1인당 영업이익 분석 섹션 (우측 정렬) */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "20px 24px",
            border: "1px solid #e4e4e7",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 700, color: "#18181b" }}>
            임직원 1인당 영업이익 분석
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            {financialData.map((data, idx) => {
              const profitInWon = data.profit * 1000000000000;
              const profitPerEmployee = Math.round(profitInWon / employeeCount);
              const isGood = profitPerEmployee > 200000000;

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "#f4f4f5",
                    border: "1px solid #e4e4e7",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#18181b" }}>
                      {data.year}
                    </span>
                    <span style={{ fontSize: "10px", color: "#71717a", marginTop: "2px" }}>
                      영업익: {data.profit}조원
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#18181b" }}>
                      1인당 {data.profit < 0 ? "-" : ""}{Math.abs(Math.round(profitPerEmployee / 10000)).toLocaleString()}만
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        backgroundColor: data.profit < 0 ? "#fee2e2" : isGood ? "#dcfce7" : "#fef9c3",
                        color: data.profit < 0 ? "#991b1b" : isGood ? "#166534" : "#854d0e",
                      }}
                    >
                      {data.profit < 0 ? "불황" : isGood ? "우수" : "보통"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 요약 재무 테이블 (전체 너비) */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          padding: "20px 24px",
          border: "1px solid #e4e4e7",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 700, color: "#18181b" }}>
          요약 재무제표 현황 (단위: 조원)
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e4e4e7", color: "#71717a" }}>
              <th style={{ padding: "10px 8px", fontWeight: "600" }}>재무 지표</th>
              <th style={{ padding: "10px 8px", fontWeight: "600" }}>2021년</th>
              <th style={{ padding: "10px 8px", fontWeight: "600" }}>2022년</th>
              <th style={{ padding: "10px 8px", fontWeight: "600" }}>2023년</th>
              <th style={{ padding: "10px 8px", fontWeight: "600" }}>2024년 (예상)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "자산총계", y21: "80.1", y22: "103.8", y23: "101.2", y24: "115.4" },
              { label: "부채총계", y21: "33.7", y22: "48.2", y23: "47.9", y24: "51.1" },
              { label: "자본총계", y21: "46.4", y22: "55.6", y23: "53.3", y24: "64.3" },
              { label: "부채비율", y21: "72.6%", y22: "86.7%", y23: "89.8%", y24: "79.4%" },
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f4f4f5", color: "#18181b" }}>
                <td style={{ padding: "10px 8px", fontWeight: "500", color: "#71717a" }}>{row.label}</td>
                <td style={{ padding: "10px 8px" }}>{row.y21}</td>
                <td style={{ padding: "10px 8px" }}>{row.y22}</td>
                <td style={{ padding: "10px 8px" }}>{row.y23}</td>
                <td style={{ padding: "10px 8px", fontWeight: "600" }}>{row.y24}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialsTab;
