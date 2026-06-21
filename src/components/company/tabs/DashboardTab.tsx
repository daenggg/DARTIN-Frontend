import React from "react";

interface DashboardTabProps {
  companyName: string;
}

interface CompanyData {
  fullName: string;
  ticker: string;
  tagline: string;
  color: string;
  bgColor: string;
  textColor: string;
  revenue: string;
  operatingProfit: string;
  news: Array<{
    press: string;
    title: string;
    desc: string;
    time: string;
    url: string;
  }>;
  aiFeedback: Array<{ icon: string; text: string }>;
  benefits: string;
  risks: string;
}

const COMPANY_DATABASE: Record<string, CompanyData> = {
  samsung: {
    fullName: "삼성전자",
    ticker: "SEC",
    tagline: "글로벌 전자 및 IT 솔루션 대표 기업",
    color: "#0a58ca",
    bgColor: "#f0f5ff",
    textColor: "#0a58ca",
    revenue: "290.4조원",
    operatingProfit: "38.2조원",
    news: [
      {
        press: "전자신문",
        title: "삼성전자, 업계 최초 CXL 2.0 D램 검증 완료... 차세대 메모리 주도",
        desc: "글로벌 고객사들과의 CXL 생태계 고도화 협력을 통해 서버용 메모리 제품 리더십을 공고히 다지는 발판을 마련했습니다.",
        time: "1시간 전",
        url: "https://www.etnews.com",
      },
      {
        press: "한국경제",
        title: "삼성전자 파운드리 3나노 2세대 공정 수율 안정화 본궤도",
        desc: "최첨단 GAA 공정을 도입하여 고성능 컴퓨팅 및 모바일 칩셋 부문 대형 고객사 수주 대응 역량을 대폭 확대했습니다.",
        time: "3시간 전",
        url: "https://www.hankyung.com",
      },
      {
        press: "동아일보",
        title: "온디바이스 AI 시대 활짝... 갤럭시 라인업 AI 고도화 추진",
        desc: "스마트폰을 넘어 웨어러블, 스마트 가전까지 자체 인공지능 비서를 탑재해 모바일 생태계 사용자 편의성을 높일 계획입니다.",
        time: "5시간 전",
        url: "https://www.donga.com",
      },
    ],
    aiFeedback: [
      { icon: "✓", text: "글로벌 탑티어 수준의 재무 안정성과 견고한 인재 육성 투자가 돋보입니다." },
      { icon: "✓", text: "메모리 및 파운드리, 모바일을 아우르는 종합 반도체 시너지가 강력합니다." },
      { icon: "✓", text: "철저한 성과 중심의 우수한 연봉 체계와 업계 최고의 커리어 상징성이 있습니다." },
    ],
    benefits: "종합 연구 개발을 위한 최고의 인프라 보장, 높은 성과 보상 및 주주환원 프로그램",
    risks: "미세 공정 한계 돌파를 위한 지속적인 R&D 투자 압박 및 모바일 완제품 글로벌 경쟁 심화",
  },
  sk: {
    fullName: "SK하이닉스",
    ticker: "SK",
    tagline: "글로벌 메모리 반도체 솔루션 선도 기업",
    color: "#e11d48",
    bgColor: "#fff1f2",
    textColor: "#e11d48",
    revenue: "52.1조원",
    operatingProfit: "16.2조원",
    news: [
      {
        press: "경향신문",
        title: "SK하이닉스, HBM 글로벌 공급망 다변화 적극 추진",
        desc: "엔비디아 등 글로벌 빅테크 수요 대응을 극대화하기 위해 국내외 연관 패키징 라인을 대대적으로 확장하고 신공정을 도입하겠다고 발표했습니다.",
        time: "1시간 전",
        url: "https://www.khan.co.kr",
      },
      {
        press: "동아일보",
        title: "반도체 흑자 턴어라운드 본격 궤도 진입",
        desc: "메모리 반도체 단가 인상 국면과 생성형 AI 서버용 HBM 및 고용량 DRAM 모듈 수주량이 전년 동기 대비 대폭 증가했습니다.",
        time: "3시간 전",
        url: "https://www.donga.com",
      },
      {
        press: "전자신문",
        title: "SK하이닉스, 차세대 'HBM4' 16단 시제품 신공정 개발 착수",
        desc: "패키징 공정 효율 극대화를 위한 어드밴스드 MR-MUF 신소재 기술을 전면 도입하여 한계를 돌파한 시제품 성능 평가에 성공했습니다.",
        time: "6시간 전",
        url: "https://www.etnews.com",
      },
    ],
    aiFeedback: [
      { icon: "✓", text: "재무적 안정성이 매우 견고하여 장기 커리어 성장에 이점을 줍니다." },
      { icon: "✓", text: "차세대 메모리(HBM) 지배력이 독보적이며 R&D 투자가 매우 활발합니다." },
      { icon: "✓", text: "유연한 소통 방식과 직원의 기술적 도전을 장려하는 연구 개발 문화를 보유했습니다." },
    ],
    benefits: "수평적인 연구개발 자율성 보장, 우수한 인프라 및 최상위 수준의 성과 중심 연봉 수준 보장",
    risks: "글로벌 거시 경제 및 원자재 단가 흐름에 따른 실적 변동 사이클 주기가 비교적 잦은 편",
  },
  hyundai: {
    fullName: "현대자동차",
    ticker: "HMC",
    tagline: "글로벌 완성차 및 미래 친환경 모빌리티 선도 기업",
    color: "#002c5f",
    bgColor: "#f0f4f9",
    textColor: "#002c5f",
    revenue: "162.5조원",
    operatingProfit: "15.1조원",
    news: [
      {
        press: "매일경제",
        title: "현대차, 미국 메타플랜트 가동 본격화... 전기차 선점 가속",
        desc: "조지아 신공장을 가동해 현지 세제 혜택과 북미 전기차 점유율 확보 속도를 전례 없이 끌어올릴 계획입니다.",
        time: "2시간 전",
        url: "https://www.mk.co.kr",
      },
      {
        press: "한국경제",
        title: "하이브리드 판매 돌풍 지속... 연간 실적 목표 상향 조정",
        desc: "글로벌 시장의 하이브리드 수요 급증에 발빠르게 대응하며 탄탄한 캐시카우 사업 구조를 입증했습니다.",
        time: "4시간 전",
        url: "https://www.hankyung.com",
      },
      {
        press: "머니투데이",
        title: "현대차, 자율주행 및 수소 생태계 구축 위한 대규모 인재 채용",
        desc: "SDV 중심의 미래 차 연구 핵심 조직을 강화하고, 최첨단 미래 모빌리티 원천기술 확보에 총력을 다합니다.",
        time: "8시간 전",
        url: "https://news.mt.co.kr",
      },
    ],
    aiFeedback: [
      { icon: "✓", text: "내연기관, 하이브리드, 전기차를 아우르는 균형 잡힌 포트폴리오로 수익성이 탄탄합니다." },
      { icon: "✓", text: "글로벌 탑티어 모빌리티 위상에 걸맞은 우수한 복지 환경 및 주주환원 정책을 시행 중입니다." },
      { icon: "✓", text: "미래 모빌리티(SDV, 수소, AAM) 신규 비즈니스 개척을 위한 채용 수요가 높습니다." },
    ],
    benefits: "업계 최상위 수준의 기본급 및 성과급 보상, 전 직원 대상 풍부한 차량 할인 혜택",
    risks: "미국 및 유럽 시장의 무역 장벽 규제 대응 여부 및 하반기 글로벌 전기차 캐즘 장기화 우려",
  },
  naver: {
    fullName: "네이버",
    ticker: "NAVER",
    tagline: "국내 1위 포털 기반 글로벌 AI 및 디지털 플랫폼 선도 기업",
    color: "#03c75a",
    bgColor: "#f0fdf4",
    textColor: "#03c75a",
    revenue: "10.5조원",
    operatingProfit: "1.8조원",
    news: [
      {
        press: "조선일보",
        title: "네이버 하이퍼클로바X, 국내 다양한 산업군 레퍼런스 급증",
        desc: "금융, 커머스, 제조 분야 맞춤형 엔터프라이즈 AI 솔루션 도입을 통해 생성형 AI 수익화를 본격적으로 가속화하고 있습니다.",
        time: "30분 전",
        url: "https://www.chosun.com",
      },
      {
        press: "이데일리",
        title: "네이버웹툰 미국 상장 성공... 글로벌 엔터 플랫폼 발돋움",
        desc: "글로벌 콘텐츠 IP 경쟁력을 앞세워 북미 및 유럽, 일본 등 글로벌 콘텐츠 플랫폼 지배력을 더욱 공고히 하고 있습니다.",
        time: "2시간 전",
        url: "https://www.edaily.co.kr",
      },
      {
        press: "디지털타임스",
        title: "소상공인 든든한 파트너... 쇼핑/광고 매출 증가 견인",
        desc: "지능형 타겟팅 광고 고도화와 커머스 구독 솔루션 강화를 통해 플랫폼 매출의 높은 탄력성을 유지하고 있습니다.",
        time: "5시간 전",
        url: "https://www.dt.co.kr",
      },
    ],
    aiFeedback: [
      { icon: "✓", text: "국내 최대의 검색 데이터 포털로, 한국형 AI 기술력 및 비즈니스 연계율이 높습니다." },
      { icon: "✓", text: "수평적이고 자율적인 사내 문화로 개발 및 연구 직군의 자율적인 역량 강화가 가능합니다." },
      { icon: "✓", text: "디지털 광고, 쇼핑, 웹툰, 클라우드 등 다변화된 캐시카우가 견고하게 유지됩니다." },
    ],
    benefits: "자유로운 재택근무 선택제 및 유연근무 환경, 최고 수준의 글로벌 커리어 기회 제공",
    risks: "구글 및 인공지능 기반 해외 검색 플랫폼의 점유율 잠식 우려 및 미디어 규제 가이드라인 강화",
  },
  kakao: {
    fullName: "카카오",
    ticker: "KAKAO",
    tagline: "국민 메신저 카카오톡 기반 모바일 라이프 플랫폼",
    color: "#eab308",
    bgColor: "#fef9c3",
    textColor: "#854d0e",
    revenue: "8.2조원",
    operatingProfit: "0.6조원",
    news: [
      {
        press: "한겨레",
        title: "카카오, 연내 카카오톡 기반 인공지능 추천 서비스 본격 도입",
        desc: "사용자 맥락 분석을 통해 생활 밀착형 쇼핑, 콘텐츠, 예약 등 지능형 AI 연동 서비스를 확대한다고 발표했습니다.",
        time: "1시간 전",
        url: "https://www.hani.co.kr",
      },
      {
        press: "디지털데일리",
        title: "카카오페이·카카오모빌리티 등 주요 계열사 지표 상승세",
        desc: "생활 밀착형 핀테크 금융 결제 인프라와 국내 1위 모빌리티 호출 서비스 수요 회복에 힘입어 영업이익 턴어라운드를 이끌고 있습니다.",
        time: "3시간 전",
        url: "https://www.ddaily.co.kr",
      },
      {
        press: "아이뉴스24",
        title: "카카오 공동체, 미래 IT 기술 인재 육성 프로그램 다각화",
        desc: "주요 개발 직군 및 비개발 직군을 위한 오픈 소스 활성화 지원과 정기 해커톤 대회를 통해 자율적인 도전을 촉진합니다.",
        time: "7시간 전",
        url: "https://www.inews24.com",
      },
    ],
    aiFeedback: [
      { icon: "✓", text: "전 국민 모바일 메신저 플랫폼의 독점적 락인(Lock-in) 효과로 사업 안정성이 큽니다." },
      { icon: "✓", text: "유연하고 자유로운 수평 소통 구조(영어 닉네임 사용 등)를 지향합니다." },
      { icon: "✓", text: "웹툰, 음악, 게임 등 강력한 문화 콘텐츠 자회사의 고성장 지표가 눈에 띕니다." },
    ],
    benefits: "리프레시 휴가 및 안식월 보상제, 세련되고 트렌디한 도심 오피스 근무 공간 지원",
    risks: "의사결정 프로세스 쇄신 과정에 따른 속도 저하 우려 및 독점 플랫폼 관련 규제 단속 강화",
  },
};

const getCompanyData = (name: string): CompanyData => {
  const norm = name.toLowerCase();
  if (norm.includes("samsung") || norm.includes("삼성")) return COMPANY_DATABASE.samsung;
  if (norm.includes("hyundai") || norm.includes("현대")) return COMPANY_DATABASE.hyundai;
  if (norm.includes("naver") || norm.includes("네이버")) return COMPANY_DATABASE.naver;
  if (norm.includes("kakao") || norm.includes("카카오")) return COMPANY_DATABASE.kakao;
  return COMPANY_DATABASE.sk; // 기본값 SK하이닉스
};

const DashboardTab: React.FC<DashboardTabProps> = ({ companyName }) => {
  const data = getCompanyData(companyName);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* 상단 2분할 레이아웃: 좌측(프로필+재무개요) / 우측(최신 뉴스) */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {/* 좌측 영역 */}
        <div
          style={{
            flex: "1 1 320px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* 기업 정보 카드 */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              padding: "24px",
              border: "1px solid #e4e4e7",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              flex: 1,
              boxSizing: "border-box",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* 로고 및 기업명 */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "6px",
                    border: "1px solid #e4e4e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: data.bgColor,
                    fontWeight: "bold",
                  }}
                >
                  <div style={{ color: data.textColor, fontSize: "10px" }}>{data.ticker}</div>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#18181b" }}>
                    {data.fullName}
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#71717a" }}>
                    {data.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* 채용 링크 알약형 버튼 세트 */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
              {["사람인 공고", "잡코리아 공고", "원티드 공고"].map((text, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    window.open(
                      idx === 0
                        ? `https://www.saramin.co.kr/zf_user/search?searchword=${data.fullName}`
                        : idx === 1
                        ? `https://www.jobkorea.co.kr/Search/?stext=${data.fullName}`
                        : `https://www.wanted.co.kr/search?query=${data.fullName}`,
                      "_blank"
                    )
                  }
                  style={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#18181b",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#f4f4f5";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* 재무제표 요약 카드 */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              padding: "24px",
              border: "1px solid #e4e4e7",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flex: 1,
              boxSizing: "border-box",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#18181b" }}>
              최근 실적 지표 요약 (2024년 예상)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", flex: 1, alignItems: "center" }}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f4f4f5",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: "11px", color: "#71717a" }}>예상 매출액</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#18181b" }}>
                  {data.revenue}
                </p>
              </div>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f4f4f5",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: "11px", color: "#71717a" }}>예상 영업이익</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "700", color: data.textColor }}>
                  {data.operatingProfit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 영역 - 최신 뉴스 (좌측 높이와 완벽하게 일치되도록 Flex-Grow 설정) */}
        <div
          style={{
            flex: "1.2 1 320px",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "24px",
            border: "1px solid #e4e4e7",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#18181b" }}>
            최신 관련 뉴스
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, justifyContent: "space-between" }}>
            {data.news.map((news, idx) => (
              <div
                key={idx}
                onClick={() => window.open(news.url, "_blank")}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "12px",
                  backgroundColor: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  flex: 1,
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#a1a1aa";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#e4e4e7";
                }}
              >
                {/* 뉴스 이미지 대표 박스 (왼쪽에 배치, 1:1 비율) */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e2e8f0",
                    backgroundImage: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                >
                  📰
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
                  <span style={{ fontSize: "10px", color: "#71717a", marginBottom: "4px", textAlign: "left" }}>
                    {news.press} • {news.time}
                  </span>
                  <h5
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#1a73e8",
                      lineHeight: "1.4",
                      textAlign: "left",
                    }}
                  >
                    {news.title}
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#71717a",
                      lineHeight: "1.5",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      textAlign: "left",
                    }}
                  >
                    {news.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 영역: AI 종합 분석 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          padding: "24px",
          border: "1px solid #e4e4e7",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#18181b" }}>
          AI 종합 분석 피드백
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {/* AI 분석 주요 의견 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.aiFeedback.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "12px", color: "#18181b", fontWeight: "700", flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: "12px", color: "#71717a", lineHeight: "1.5" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* 피팅 정보 */}
          <div
            style={{
              borderLeft: "1px solid #e4e4e7",
              paddingLeft: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <h5 style={{ margin: "0 0 4px 0", fontSize: "12px", fontWeight: "700", color: "#18181b" }}>
                주요 혜택 및 장점
              </h5>
              <p style={{ margin: 0, fontSize: "11px", color: "#71717a", lineHeight: "1.6" }}>
                {data.benefits}
              </p>
            </div>
            <div>
              <h5 style={{ margin: "0 0 4px 0", fontSize: "12px", fontWeight: "700", color: "#18181b" }}>
                주의 리스크 포인트
              </h5>
              <p style={{ margin: 0, fontSize: "11px", color: "#71717a", lineHeight: "1.6" }}>
                {data.risks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
