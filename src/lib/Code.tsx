import type { CodeExcerpt } from "../data";

const KEYWORDS =
  /\b(def|class|return|if|else|not|in|is|None|import|from|raise|try|except|const|let|export|function|CREATE|TABLE|INDEX|PARTITION|OF|FOR|VALUES|FROM|TO|ON|BY|RANGE|PRIMARY|KEY|NULL|DEFAULT|INT|DATE|SERIAL|TIMESTAMP|DROP|EXISTS|IF)\b/;
const TOKENS =
  /(#.*$|--.*$|\/\/.*$|\{\/\*.*\*\/\})|(f?"[^"]*"|f?'[^']*'|`[^`]*`)|\b(def|class|return|if|else|not|in|is|None|import|from|raise|try|except|const|let|export|function|CREATE|TABLE|INDEX|PARTITION|OF|FOR|VALUES|FROM|TO|ON|BY|RANGE|PRIMARY|KEY|NULL|DEFAULT|INT|DATE|SERIAL|TIMESTAMP|DROP|EXISTS|IF)\b/g;

/** Monochrome highlighting: keywords bright, strings mid, comments dim. */
function Line({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKENS)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const [tok, comment, str] = m;
    const cls = comment ? "text-dim" : str ? "text-bone/75" : KEYWORDS.test(tok) ? "text-bone" : "";
    out.push(
      <span key={i} className={cls}>
        {tok}
      </span>,
    );
    last = i + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out.length ? out : " "}</>;
}

export function CodeBlock({ code, className = "" }: { code: CodeExcerpt; className?: string }) {
  const lines = code.lines.split("\n");
  return (
    <pre className={`mono m-0 text-[11.5px] leading-[1.75] text-ash ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="flex">
          <span className="w-8 shrink-0 select-none pr-3 text-right text-dim/60">{i + 1}</span>
          <span className="whitespace-pre">
            <Line text={l} />
          </span>
        </span>
      ))}
    </pre>
  );
}
