import React, { useState, useEffect } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [targetCoords, setTargetCoords] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // 가이드가 다시 실행되거나 새로 열릴 때마다 1단계(Tip 1)로 강제 복구 초기화
  useEffect(() => {
    if (isOpen) {
      setOnboardingStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const calculateCoords = () => {
      let selector = "";
      if (onboardingStep === 1) selector = "#onboarding-sidebar-btn";
      else if (onboardingStep === 2) selector = "#onboarding-chat-input";
      else if (onboardingStep === 3) selector = "#onboarding-dashboard-nav";

      if (selector) {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          
          let top = rect.top;
          let height = rect.height;
          
          // 대시보드 탭 가이드 시 주황색 하이라이트 박스의 세로 높이를 타이트하게 축소 보정
          if (onboardingStep === 3) {
            top = rect.top + 6;
            height = rect.height - 12;
          }

          setTargetCoords({
            top,
            left: rect.left,
            width: rect.width,
            height,
          });
          return;
        }
      }
      setTargetCoords(null);
    };

    calculateCoords();
    const timer = setTimeout(calculateCoords, 100);

    window.addEventListener("resize", calculateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateCoords);
    };
  }, [isOpen, onboardingStep]);

  if (!isOpen) return null;

  // 툴팁 위치 스타일
  let tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    width: "100%",
    maxWidth: "260px",
  };

  if (targetCoords) {
    const leftPos = onboardingStep === 1 
      ? targetCoords.left - 6 
      : targetCoords.left + targetCoords.width / 2 - 130;
    
    const safeLeft = Math.max(12, Math.min(window.innerWidth - 272, leftPos));

    if (onboardingStep === 1) {
      tooltipStyle = {
        ...tooltipStyle,
        top: `${targetCoords.top + targetCoords.height + 10}px`,
        left: `${safeLeft}px`,
      };
    } else if (onboardingStep === 2) {
      tooltipStyle = {
        ...tooltipStyle,
        bottom: `${window.innerHeight - targetCoords.top + 10}px`,
        left: `${safeLeft}px`,
      };
    } else if (onboardingStep === 3) {
      tooltipStyle = {
        ...tooltipStyle,
        top: `${targetCoords.top + targetCoords.height + 10}px`,
        left: `${safeLeft}px`,
      };
    }
  } else {
    tooltipStyle = {
      ...tooltipStyle,
      position: "fixed",
      top: "15%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  return (
    <>
      {/* 타겟 요소를 감싸는 하이라이트 보더라인 */}
      {targetCoords && (
        <div 
          className="fixed rounded-md border border-solid z-[9998] transition-all duration-300 pointer-events-none"
          style={{
            borderColor: "var(--accent)",
            boxShadow: "0 0 0 2px rgba(var(--accent-rgb, 239, 68, 68), 0.12)",
            top: `${targetCoords.top - 2}px`,
            left: `${targetCoords.left - 3}px`,
            width: `${targetCoords.width + 6}px`,
            height: `${targetCoords.height + 4}px`,
          }}
        />
      )}

      {/* 2. 초소형 툴팁 가이드 (꼭짓점 꼬리표 제거하여 Sleek한 패널 스타일 완성) */}
      <div 
        style={tooltipStyle}
        className="rounded-xl border border-solid p-2.5 shadow-md flex flex-col box-border animate-fade-in text-left select-none"
      >
        <div 
          className="absolute inset-0 rounded-xl -z-10 backdrop-blur-md"
          style={{ 
            background: "var(--bg-panel)", 
            borderColor: "var(--border)",
            opacity: 1 
          }}
        />

        {/* 가이드 콘텐츠 */}
        <div className="w-full relative pr-4 box-border">
          {/* 가이드 취소 엑스 버튼 */}
          <button 
            onClick={onClose}
            className="absolute top-0 right-1.5 bg-transparent border-none text-[16px] font-bold cursor-pointer hover:opacity-75 transition-opacity"
            style={{ color: "var(--text)" }}
            title="가이드 닫기"
          >
            ×
          </button>

          {onboardingStep === 1 && (
            <div>
              <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded mr-1.5" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                TIP 1
              </span>
              <strong className="text-[11px] font-bold" style={{ color: "var(--text-h)" }}>히스토리 및 즐겨찾기</strong>
              <p className="m-0 text-[10px] leading-relaxed mt-1" style={{ color: "var(--text)" }}>
                폴더 버튼을 클릭해 대화 목록을 확인하고, 핀(Pin) 아이콘을 눌러 주요 기업 세션을 고정할 수 있습니다.
              </p>
            </div>
          )}
          {onboardingStep === 2 && (
            <div>
              <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded mr-1.5" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                TIP 2
              </span>
              <strong className="text-[11px] font-bold" style={{ color: "var(--text-h)" }}>실시간 AI 질답</strong>
              <p className="m-0 text-[10px] leading-relaxed mt-1" style={{ color: "var(--text)" }}>
                궁금한 기업명을 검색창에 입력하면 AI가 공시 정보, 뉴스, 채용 공고를 한데 모아 진단을 시작합니다.
              </p>
            </div>
          )}
          {onboardingStep === 3 && (
            <div>
              <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded mr-1.5" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                TIP 3
              </span>
              <strong className="text-[11px] font-bold" style={{ color: "var(--text-h)" }}>대시보드 탭</strong>
              <p className="m-0 text-[10px] leading-relaxed mt-1" style={{ color: "var(--text)" }}>
                매출/영업익 실적 그래프, DART 요약 재무 테이블 및 최신 긍부정 뉴스, 실시간 채용 퀵 링크를 확인하세요.
              </p>
            </div>
          )}
        </div>

        {/* 슬림화된 푸터 및 작고 둥근 버튼 */}
        <div className="flex justify-between items-center w-full mt-3 pt-2 border-t border-solid" style={{ borderColor: "var(--border)" }}>
          <span className="text-[9px] font-bold" style={{ color: "var(--text)" }}>
            {onboardingStep} / 3
          </span>
          
          <div className="flex gap-1.5">
            {onboardingStep < 3 ? (
              <button
                onClick={() => setOnboardingStep((prev) => prev + 1)}
                className="py-0.5 px-2.5 rounded-full text-[9px] font-bold text-white cursor-pointer transition-colors border-none shadow-sm hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
              >
                다음
              </button>
            ) : (
              <button
                onClick={onClose}
                className="py-0.5 px-2.5 rounded-full text-[9px] font-bold text-white cursor-pointer transition-colors border-none shadow-sm hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingModal;
