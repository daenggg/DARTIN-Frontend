import React from "react";

const CompanyInfoTab: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* 상세 개요 카드 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #e4e4e7",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: "15px", fontWeight: 700, color: "#18181b" }}>
          기업 기본 정보
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[
            { label: "CEO (대표이사)", value: "곽노정 대표이사 사장" },
            { label: "설립일", value: "1983년 2월 24일" },
            { label: "직원 수 (임직원)", value: "32,125명 (2024년 사업보고서 기준)" },
            { label: "본사 소재지", value: "경기도 이천시 경충대로 2091" },
            { label: "주요 사업", value: "반도체 소자 제조 및 판매 (DRAM, NAND, HBM 등)" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                borderBottom: "1px solid #f4f4f5",
                paddingBottom: "12px",
                fontSize: "13px",
              }}
            >
              <span style={{ width: "140px", color: "#71717a", fontWeight: "500" }}>{item.label}</span>
              <span style={{ color: "#18181b", fontWeight: "600" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 비전 및 핵심 가치 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #e4e4e7",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: "15px", fontWeight: 700, color: "#18181b" }}>
          핵심 기업 비전
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            {
              title: "We Do Technology",
              desc: "첨단 반도체 기술력을 바탕으로 새로운 사회 가치를 창출하고, 인류 문명의 더 나은 지속가능성을 선도합니다.",
            },
            {
              title: "HBM Global Leader",
              desc: "독보적인 수직 적층 패키징 공정 기술을 개발하여 다가올 글로벌 인공지능 시대를 가속화합니다.",
            },
            {
              title: "Eco-Friendly ESG",
              desc: "생산 인프라 전 과정의 저탄소 배출 필터 기술 및 재생에너지를 도입하여 친환경 제조업을 개척합니다.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#f4f4f5",
                padding: "20px",
                borderRadius: "6px",
                border: "1px solid #e4e4e7",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "700", color: "#18181b" }}>
                {card.title}
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.6" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTab;
