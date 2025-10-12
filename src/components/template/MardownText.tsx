import { isHTML } from "@/helpers/string_helpers";
import { JSX, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdowntext({
  component,
  beforeAfter,
}: {
  component: "ascvd" | "bmi" | "waist" | "ggr" | "diabetes" | "overall";
  beforeAfter: "before" | "after";
}): JSX.Element {
  const [markdownContent, setMarkdownContent] = useState<string>();

  useEffect(() => {
    const fetchMarkdown = async () => {
      const filePath = `resources/text/${component}-${beforeAfter}.md`;
      const response = await fetch(filePath);
      if (!response.ok) {
        console.log("Niet gelukt");

        throw new Error("Network response was not ok");
      } else {
        const text = await response.text();
        if (!isHTML(text)) {
          setMarkdownContent(text);
        }
      }
    };
    fetchMarkdown();
  }, []);

  return (
    <>
      {markdownContent && (
        <div className="prose markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
}
