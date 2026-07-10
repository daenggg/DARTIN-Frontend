import { useState, useEffect, type MouseEvent as ReactMouseEvent } from "react";

export const useResizer = (initialRatio = 0.35) => {
  const [leftWidth, setLeftWidth] = useState<number>(() =>
    Math.round(window.innerWidth * initialRatio)
  );
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.6; // 최대 화면의 60%까지
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return { leftWidth, isResizing, handleMouseDown };
};
