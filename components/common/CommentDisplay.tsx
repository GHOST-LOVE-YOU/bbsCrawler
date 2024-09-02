"use client";

import React, { useEffect, useState } from "react";

interface CommentDisplayProps {
  content: string;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({ content }) => {
  const [formattedContent, setFormattedContent] = useState("");

  useEffect(() => {
    setFormattedContent(formatContent(content || ""));
  }, [content]);

  const formatContent = (text: string) => {
    const lines = text.split("<br>");

    let isInQuote = false;
    const formattedLines = lines.map((line, index) => {
      if (line.startsWith("【 在 ") && line.includes(" 的大作中提到: 】")) {
        isInQuote = true;
        return `<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mt-2">${line}`;
      } else if (line.startsWith('<font class="f006">: ')) {
        const quoteContent = line
          .replace('<font class="f006">: ', "")
          .replace("</font>", "");
        return `${quoteContent}`;
      } else if (isInQuote) {
        isInQuote = false;
        return `</div>${line}`;
      }
      return line;
    });

    return formattedLines.join("<br>");
  };

  return (
    <div
      className="text-text-light dark:text-text-dark break-words whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default CommentDisplay;
