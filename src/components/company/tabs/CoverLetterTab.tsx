import React from "react";

const CoverLetterTab: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #e3e3e3",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#1f1f1f" }}>
            ✍️ 자소서 피드백 도우미
          </h3>
          <span style={{ fontSize: "12px", color: "#5f6368", fontWeight: "600" }}>AI 실시간 가이드</span>
        </div>

        {/* 문항 가이드 및 팁 영역 */}
        <div
          style={{
            backgroundColor: "#f0f4f9",
            border: "1px solid #cbd5e1",
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#4285f4", marginBottom: "6px" }}>
            [공통 문항 1번]
          </div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#1f1f1f", lineHeight: "1.5" }}>
            지원 분야와 관련된 본인의 역량을 준비하기 위해 노력한 점을 구체적인 사례를 바탕으로 기술해 주십시오. (전공 학업, 프로젝트, 연구 활동 등 활용) (최대 1,000자)
          </div>
        </div>

        {/* 작성 팁 */}
        <div
          style={{
            backgroundColor: "#f4f0fa",
            border: "1px solid #9b72cb40",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "13px",
            color: "#6b21a8",
            marginBottom: "20px",
            lineHeight: "1.6",
          }}
        >
          <strong>✦ AI 추천 키워드 제안:</strong> 
          <span style={{ marginLeft: "8px", textDecoration: "underline", fontWeight: "bold" }}>
            MR-MUF 패키징, D램 수율 안정화, 나노 공정 회로 시뮬레이션, 수율 통계 최적화(DOE)
          </span>
          <br />
          반도체 공정 및 설계 직무는 세부 실험 데이터의 오차 범위를 줄여 신뢰성을 입증했던 프로젝트를 두괄식으로 기술하세요.
        </div>

        {/* 자소서 텍스트 영역 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <textarea
            placeholder="여기에 작성 중인 자기소개서 본문을 입력해 보세요. 작성 완료 후 아래 첨삭 버튼을 누르면 AI가 전문 기술 키워드 매칭율 분석 보고서를 즉시 출력합니다."
            style={{
              width: "100%",
              height: "160px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              padding: "16px",
              fontSize: "13px",
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              lineHeight: "1.6",
              backgroundColor: "#ffffff",
              fontFamily: "'Outfit', 'Inter', sans-serif",
            }}
          ></textarea>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => alert("자기소개서 AI 피드백 분석 리포트가 성공적으로 출력되었습니다.")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #9b72cb",
                color: "#9b72cb",
                borderRadius: "100px", // 알약형 버튼
                padding: "10px 22px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f4f0fa";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              ✦ AI 실시간 피드백 및 자소서 진단 ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterTab;
