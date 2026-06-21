import React from "react";

const JobOpeningsTab: React.FC = () => {
  const jobs = [
    {
      title: "HBM 설계 및 제품 개발 엔지니어 (DRAM 사업본부)",
      status: "D-5",
      location: "이천 본사",
      detail: "고속 메모리 D램 물리 계층 레이아웃 회로 정합성 검증 및 차세대 HBM3/HBM4 공정 회로 시뮬레이션 엔지니어 선발",
    },
    {
      title: "차세대 반도체 신기술 소자 및 박막 공정 연구원",
      status: "D-12",
      location: "이천 / 청주 공장",
      detail: "10나노급 미세 패터닝 공정 및 수율 최적화 분석 파이프라인 개발, 박막 증착 신소재 물성 특성 평가 및 신뢰성 분석 담당",
    },
    {
      title: "공정 센서 데이터 기반 이상 징후 분석 AI 엔지니어",
      status: "상시채용",
      location: "분당 사옥 / 이천",
      detail: "FAB 공정 설비의 시계열 센서 스트리밍 데이터 전처리 및 실시간 수율 저하 예측 딥러닝 모형 파이프라인 설계 시스템 엔지니어 공채",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f1f1f" }}>
          💼 진행 중인 채용 정보
        </h3>
        <span style={{ fontSize: "12px", color: "#5f6368" }}>실시간 채용정보 공식 동기화 활성화</span>
      </div>

      {/* 공고 카드 목록 */}
      {jobs.map((job, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "20px 24px",
            border: "1px solid #e3e3e3",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "border-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#9b72cb")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e3e3e3")}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#9b72cb",
                  backgroundColor: "#f4f0fa",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  border: "1px solid #9b72cb40",
                }}
              >
                {job.status}
              </span>
              <span style={{ fontSize: "12px", color: "#5f6368" }}>📍 {job.location}</span>
            </div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", color: "#1f1f1f" }}>
              {job.title}
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
              {job.detail}
            </p>
          </div>
          <button
            onClick={() => alert("해당 채용공고의 공식 지원 페이지로 이동합니다.")}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#3c4043",
              padding: "8px 16px",
              borderRadius: "100px", // 알약 모양
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f4f9";
              e.currentTarget.style.borderColor = "#a8a8a8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            공식 지원 🚀
          </button>
        </div>
      ))}
    </div>
  );
};

export default JobOpeningsTab;
