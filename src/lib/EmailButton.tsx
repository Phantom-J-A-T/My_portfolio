import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { PROFILE } from "../data";

interface Props {
  className?: string;
  /** Show the address itself, or a short label. */
  label?: string;
  solid?: boolean;
}

/**
 * Copies the address on click, because a bare mailto does nothing for anyone
 * on webmail. The arrow beside it opens the mail app for everyone else.
 */
export function EmailButton({ className = "", label, solid = false }: Props) {
  const [copied, setCopied] = useState(false);
  const email = PROFILE.email();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={copy}
        className={`pill min-w-0 flex-1 ${solid ? "pill-solid" : ""}`}
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 shrink-0" aria-hidden />
            Copied to clipboard
          </>
        ) : (
          <span className="truncate">{label ?? email}</span>
        )}
      </button>
      <a
        href={`mailto:${email}`}
        className="pill icon-btn shrink-0"
        aria-label="Open in your mail app"
        title="Open in your mail app"
      >
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
