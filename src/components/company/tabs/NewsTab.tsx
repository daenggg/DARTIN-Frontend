import React from "react";

const NewsTab: React.FC = () => {
  const newsList = [
    {
      category: "속보",
      color: "#9b72cb",
      bgColor: "#f4f0fa",
      press: "한국경제 • 1시간 전",
      title: "[속보] 독점 '여론조사 대응 태스크(TF)' 설치에 나선 SK하이닉스... HBM 시장 굳히기 나선다",
      desc: "SK하이닉스가 글로벌 고대역폭 메모리(HBM) 시장에서의 선점 지위를 유지하고 경쟁사들의 추격을 저지하기 위해 내부 대응 부서 및 리서치 전담 기구를 확대 설치하기로 발표했습니다.",
      url: "https://www.hankyung.com",
    },
    {
      category: "기술/연구",
      color: "#4285f4",
      bgColor: "#f0f4f9",
      press: "전자신문 • 3시간 전",
      title: "SK하이닉스, 차세대 'HBM4' 16단 시제품 신공정 개발 착수... 2026년 대량 양산 목표 선점",
      desc: "패키징 공정 효율 극대화를 위한 어드밴스드 MR-MUF 신소재 기술을 전면 도입하여 두께 제한 한계를 돌파한 16단 적층 시제품 성능 평가에 성공했습니다.",
      url: "https://www.etnews.com",
    },
    {
      category: "공급망",
      color: "#4f46e5",
      bgColor: "#f0effd",
      press: "연합뉴스 • 12시간 전",
      title: "SK하이닉스 청주/이천 공장 생산라인 가동률 최대로... 실적 턴어라운드 본궤도 진입",
      desc: "글로벌 대형 빅테크 기업들의 서버 증설 및 생성형 AI 인프라 고도화 트렌드와 맞물려 메모리 반도체 공장 웨이퍼 가동률이 작년 동기 대비 대폭 향상되었습니다.",
      url: "https://www.yna.co.kr",
    },
    {
      category: "인사/채용",
      color: "#0d9488",
      bgColor: "#f0fdfa",
      press: "디지털데일리 • 1일 전",
      title: "SK하이닉스 하반기 대졸 신입 인재 세 자릿수 공채 개시... HBM 수율 관리 연구원 집중 육성",
      desc: "설계, 소자 공정 개발 뿐만 아니라 수율 안정성을 확보할 데이터 분석 전문가 및 패키징 엔지니어 선발 비율을 전년 대비 30% 이상 증대해 채용을 확대합니다.",
      url: "https://www.ddaily.co.kr",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#18181b" }}>
          실시간 기업 관련 뉴스 피드
        </h3>
      </div>

      {newsList.map((news, idx) => (
        <div
          key={idx}
          onClick={() => window.open(news.url, "_blank")}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "20px 24px",
            border: "1px solid #e4e4e7",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#a1a1aa")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
        >
          {/* 뉴스 이미지 대표 박스 (왼쪽 1:1 배치) */}
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#e2e8f0",
              backgroundImage: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          >
            📰
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: news.color,
                  backgroundColor: news.bgColor,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                {news.category}
              </span>
              <span style={{ fontSize: "12px", color: "#71717a" }}>{news.press}</span>
            </div>
            <h4
              style={{
                margin: "0 0 6px 0",
                fontSize: "14px",
                fontWeight: "700",
                color: "#18181b",
                lineHeight: "1.4",
                textAlign: "left",
              }}
            >
              {news.title}
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.6", textAlign: "left" }}>
              {news.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsTab;
