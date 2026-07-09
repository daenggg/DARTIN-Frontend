import React from "react";

interface MarkdownRendererProps {
  content: string;
}

// 인라인 마크다운 파서
const parseInline = (text: string): React.ReactNode[] => {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} style={{ fontWeight: "700", color: "var(--text-h)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          style={{
            backgroundColor: "var(--bg)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "0.9em",
            fontFamily: "monospace",
            color: "var(--accent)",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const lines = content.split("\n");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
      }}
    >
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h5
              key={lineIdx}
              style={{
                margin: "12px 0 6px 0",
                fontWeight: "700",
                fontSize: "1.1em",
                color: "var(--text-h)",
              }}
            >
              {parseInline(trimmed.substring(4))}
            </h5>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h4
              key={lineIdx}
              style={{
                margin: "14px 0 8px 0",
                fontWeight: "700",
                fontSize: "1.25em",
                color: "var(--text-h)",
              }}
            >
              {parseInline(trimmed.substring(3))}
            </h4>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h3
              key={lineIdx}
              style={{
                margin: "16px 0 10px 0",
                fontWeight: "700",
                fontSize: "1.4em",
                color: "var(--text-h)",
              }}
            >
              {parseInline(trimmed.substring(2))}
            </h3>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                gap: "8px",
                paddingLeft: "8px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "var(--text)",
                  fontSize: "1.1em",
                  lineHeight: "1.6",
                }}
              >
                •
              </span>
              <span style={{ flex: 1, lineHeight: "1.6", textAlign: "left" }}>
                {parseInline(trimmed.substring(2))}
              </span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                gap: "8px",
                paddingLeft: "8px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "var(--text)",
                  fontWeight: "600",
                  minWidth: "16px",
                  textAlign: "right",
                  lineHeight: "1.6",
                }}
              >
                {numMatch[1]}.
              </span>
              <span style={{ flex: 1, lineHeight: "1.6", textAlign: "left" }}>
                {parseInline(numMatch[2])}
              </span>
            </div>
          );
        }

        // 4. 빈 줄 (줄바꿈 공백)
        if (!trimmed) {
          return <div key={lineIdx} style={{ height: "4px" }} />;
        }

        // 5. 일반 단락
        return (
          <p
            key={lineIdx}
            style={{ margin: 0, lineHeight: "1.6", textAlign: "left" }}
          >
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};
