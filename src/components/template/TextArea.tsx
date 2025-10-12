const TextAreaResult = ({
  content,
  className,
}: {
  content?: string | null;
  className?: string;
}) => {
  if (!content) return null;
  return (
    <textarea
      value={content}
      readOnly
      className={`w-full resize-none overflow-hidden${className ? ` ${className}` : ""}`}
      rows={1}
      style={{
        height: "auto",
      }}
      ref={(el) => {
        if (el) {
          el.style.height = "auto";
          const lineCount = (content?.match(/\n/g)?.length ?? 0) + 1;
          if (lineCount === 1) {
            // Set height to one line
            el.style.height = el.scrollHeight + "px";
          } else {
            // Let it expand to fit all lines
            el.style.height = el.scrollHeight + "px";
          }
        }
      }}
    />
  );
};

export default TextAreaResult;
