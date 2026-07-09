import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "삭제",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-[99999] flex items-center justify-center p-4 box-border">
      <div
        className="w-full max-w-[290px] rounded-2xl border border-solid p-4 shadow-2xl flex flex-col font-sans box-border text-left"
        style={{ background: "var(--bg-panel)", borderColor: "var(--border)" }}
      >
        <h3
          className="m-0 mb-1.5 text-md font-extrabold tracking-tight"
          style={{ color: "var(--text-h)" }}
        >
          {title}
        </h3>
        <p className="m-0 mb-4.5 text-xs leading-relaxed" style={{ color: "var(--text)" }}>
          {message}
        </p>

        <div className="flex gap-2 justify-end w-full">
          <button
            onClick={onCancel}
            className="py-0.5 px-3.5 rounded-full text-[11px] font-bold border border-solid cursor-pointer bg-transparent transition-all duration-150"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="py-0.5 px-3.5 rounded-full text-[11px] font-bold cursor-pointer text-white transition-all duration-150 border-none bg-red-500 hover:bg-red-600 shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
