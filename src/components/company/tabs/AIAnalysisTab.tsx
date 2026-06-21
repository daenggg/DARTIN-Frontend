import React from "react";

const AIAnalysisTab: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* SWOT 분석 카드 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #e3e3e3",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700, color: "#1f1f1f" }}>
          ✦ AI SWOT 정밀 분석 리포트
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            {
              title: "Strength (강점)",
              color: "#4285f4",
              bg: "#f0f4f9",
              items: [
                "글로벌 고대역폭 메모리(HBM) 기술 1위 선점",
                "MR-MUF 액체 패키징 등 고신뢰성 독자 공정 소유",
                "엔비디아 D램 공식 납품 협력 체계 공고화",
              ],
            },
            {
              title: "Weakness (약점)",
              color: "#d96570",
              bg: "#faf0f1",
              items: [
                "NAND 사업부의 솔리다임 인수 후 비용 안정화 지연",
                "차세대 미세 패터닝 공정 설비 투자 고정비 부담",
                "기초 시스템 반도체(비메모리 파운드리) 시장 입지 취약",
              ],
            },
            {
              title: "Opportunity (기회)",
              color: "#9b72cb",
              bg: "#f4f0fa",
              items: [
                "온디바이스 AI 기기 대중화에 따른 고성능 D램 수요 급증",
                "차세대 고용량 규격 CXL 모듈 시장 선도 기회",
                "글로벌 빅테크 기업들의 인공지능 데이터센터 대형 수주 기조",
              ],
            },
            {
              title: "Threat (위협)",
              color: "#f4b400",
              bg: "#fffcf0",
              items: [
                "경쟁사들의 HBM3E/HBM4 시장 퀄 테스트 통과 및 맹격",
                "글로벌 무역 갈등 장기화 및 대중국 장비 반입 추가 규제 리스크",
                "메모리 반도체 전문 R&D 인력 확보 경쟁 격화",
              ],
            },
          ].map((swot, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: swot.bg,
                padding: "18px",
                borderRadius: "14px",
                border: `1px solid ${swot.color}20`,
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "700", color: swot.color }}>
                {swot.title}
              </h4>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#475569", display: "flex", flexDirection: "column", gap: "6px" }}>
                {swot.items.map((item, i) => (
                  <li key={i} style={{ lineHeight: "1.5" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 종합 제언 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #e3e3e3",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 700, color: "#1f1f1f" }}>
          🎯 AI 합격 가이드라인 제언
        </h3>
        <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
          SK하이닉스는 HBM 시장의 주도권을 쥐며 실적 턴어라운드를 이루어 가고 있습니다. 
          따라서 자기소개서 작성 시 본인의 반도체 실험 데이터 처리 경험이나 통계 분석 역량을 강조하며, 회사의 최신 수율 관리 기술(MR-MUF 공정 등)과 전공 역량이 어떻게 연결되는지를 수치(예: 불량 검출 정밀도 개선율)로 설명하는 전략이 효과적입니다.
        </p>
      </div>
    </div>
  );
};

export default AIAnalysisTab;
