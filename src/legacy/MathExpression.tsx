import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathExpression({
  equation,
  displayMode = false,
}: {
  equation?: string;
  displayMode?: boolean;
}) {
  if (!equation) {
    return null;
  }

  try {
    return (
      <span
        className={
          displayMode ? "block overflow-x-auto py-2" : "align-baseline"
        }
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(equation, {
            displayMode,
            throwOnError: false,
          }),
        }}
      />
    );
  } catch {
    return <code className="font-tech text-primary-strong">{equation}</code>;
  }
}
