import { isHTML } from "@/helpers/string_helpers";
import { JSX, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdowntext({
  component,
  beforeAfter,
}: {
  component:
    | "score2"
    | "bmi"
    | "waist"
    | "ggr"
    | "diabetes"
    | "overall"
    | "biologicage";
  beforeAfter: "before" | "after";
}): JSX.Element {
  const [markdownContent, setMarkdownContent] = useState<string>();

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const filePath = `resources/text/${component}-${beforeAfter}.md`;
        const text = await window.fileAPI.readFile(filePath);
        if (!isHTML(text)) {
          setMarkdownContent(text);
        }
      } catch (error) {
        console.error(
          `Error loading markdown file for ${component}-${beforeAfter}:`,
          error,
        );
        // Set a fallback content or leave empty
        setMarkdownContent(undefined);
      }
    };
    fetchMarkdown();
  }, [component, beforeAfter]);

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
