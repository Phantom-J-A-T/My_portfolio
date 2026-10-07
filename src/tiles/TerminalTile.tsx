import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PROFILE, PROJECTS, TOOLCHAIN, type Filter } from "../data";
import { useSite } from "../lib/site";
import { soundtrack } from "../lib/sound";

type Line = { kind: "in" | "out"; text: string };

const PROMPT = "visitor@phantom:~$";
const VERB_TO_FILTER: Record<string, Filter> = { all: "all", build: "web", break: "sec", measure: "data" };

export function TerminalTile() {
  const { setFilter, openProject } = useSite();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "phantom shell. type 'help' to see what it can do." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [demoDone, setDemoDone] = useState(false);
  const tileRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const email = PROFILE.email();

  const commands: Record<string, { help: string; run: (args: string[]) => string[] | null }> = {
    help: {
      help: "list commands",
      run: () =>
        Object.entries(commands).map(([name, c]) => `  ${name.padEnd(14)}${c.help}`),
    },
    whoami: {
      help: "who runs this place",
      run: () => [
        `${PROFILE.name.toLowerCase()} (@${PROFILE.handle})`,
        "full-stack developer · security · data",
        `${PROFILE.location.toLowerCase()}, remote`,
      ],
    },
    ls: {
      help: "list projects",
      run: () => [PROJECTS.map((p) => `${p.id}/`).join("  ")],
    },
    open: {
      help: "open <project> case study",
      run: ([id]) => {
        const p = PROJECTS.find((x) => x.id === id);
        if (!p) return [id ? `open: no such project: ${id}` : "usage: open <project>   (try 'ls')"];
        window.setTimeout(() => openProject(p.id), 250);
        return [`opening ${p.id}…`];
      },
    },
    stack: {
      help: "tools by discipline",
      run: () =>
        (["web", "sec", "data"] as const).map(
          (d) => `  ${d.padEnd(6)}${TOOLCHAIN.filter((t) => t.d === d).map((t) => t.name.toLowerCase()).join(", ")}`,
        ),
    },
    filter: {
      help: "build | break | measure | all",
      run: ([v]) => {
        const f = VERB_TO_FILTER[v];
        if (!f) return ["usage: filter build | break | measure | all"];
        setFilter(f);
        return [`showing: ${v}`];
      },
    },
    nmap: {
      help: "scan this host",
      run: () => [
        "Nmap scan report for phantom (127.0.0.1)",
        "PORT     STATE  SERVICE",
        `25/tcp   open   smtp      ${email}`,
        "443/tcp  open   https     you're looking at it",
        "22/tcp   closed ssh       nice try",
      ],
    },
    "sudo": {
      help: "hire-me",
      run: ([what]) => {
        if (what !== "hire-me") return ["sudo: only 'sudo hire-me' is allowed here"];
        navigator.clipboard?.writeText(email).catch(() => {});
        return ["[sudo] password for visitor: ********", `access granted. ${email} copied to clipboard.`];
      },
    },
    music: {
      help: "on | off: the soundtrack",
      run: ([v]) => {
        const track = soundtrack();
        if (v === "on") {
          track.start();
          return ["synth online. 92 bpm, A minor. scroll to open the filter."];
        }
        if (v === "off") {
          track.stop();
          return ["synth offline."];
        }
        return [`usage: music on | off   (currently ${track.playing ? "on" : "off"})`];
      },
    },
    date: {
      help: "local time in lagos",
      run: () => [new Date().toLocaleString("en-GB", { timeZone: PROFILE.timezone }) + " WAT"],
    },
    history: { help: "past commands", run: () => history.map((h, i) => `  ${i + 1}  ${h}`) },
    clear: { help: "clear the screen", run: () => null },
  };

  const exec = (raw: string) => {
    const text = raw.trim();
    const echo: Line = { kind: "in", text };
    if (!text) return setLines((l) => [...l, echo]);
    setHistory((h) => [...h, text]);
    setCursor(-1);

    const [name, ...args] = text.split(/\s+/);
    if (name === "rm") return setLines((l) => [...l, echo, { kind: "out", text: "nice try." }]);
    if (name === "exit") return setLines((l) => [...l, echo, { kind: "out", text: "there is no exit. only email." }]);
    if (name === "echo") return setLines((l) => [...l, echo, { kind: "out", text: args.join(" ") }]);

    const cmd = commands[name];
    if (!cmd) {
      return setLines((l) => [...l, echo, { kind: "out", text: `command not found: ${name}. try 'help'` }]);
    }
    const out = cmd.run(args);
    if (out === null) return setLines([]);
    setLines((l) => [...l, echo, ...out.map((t) => ({ kind: "out" as const, text: t }))]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown" && cursor >= 0) {
      e.preventDefault();
      const next = cursor + 1;
      setCursor(next >= history.length ? -1 : next);
      setInput(next >= history.length ? "" : history[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [head, arg] = input.split(/\s+/);
      if (arg !== undefined && head === "open") {
        const hit = PROJECTS.find((p) => p.id.startsWith(arg));
        if (hit) setInput(`open ${hit.id}`);
      } else {
        const hit = Object.keys(commands).find((c) => c.startsWith(input));
        if (hit) setInput(hit + " ");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  // Types "whoami" once, the first time the terminal scrolls into view.
  useEffect(() => {
    const el = tileRef.current;
    if (!el || demoDone) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (still) {
          exec("whoami");
          setDemoDone(true);
          return;
        }
        const word = "whoami";
        let i = 0;
        const type = () => {
          i++;
          setInput(word.slice(0, i));
          if (i < word.length) timer = window.setTimeout(type, 90);
          else
            timer = window.setTimeout(() => {
              exec(word);
              setInput("");
              setDemoDone(true);
            }, 350);
        };
        timer = window.setTimeout(type, 600);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <section
      ref={tileRef}
      className="tile flex h-[380px] cursor-text flex-col"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      aria-label="Interactive terminal"
    >
      <header className="flex items-center justify-between border-b border-edge px-5 py-3.5">
        <span className="label">Terminal</span>
        <span className="label text-dim">try: sudo hire-me</span>
      </header>
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="mono thin-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-4 text-[12px] leading-[1.75]"
        role="log"
        aria-live="polite"
      >
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${l.kind === "in" ? "text-bone" : "text-ash"}`}>
            {l.kind === "in" && <span className="text-dim">{PROMPT} </span>}
            {l.text}
          </p>
        ))}
        <label className="flex items-center text-bone">
          <span className="text-dim">{PROMPT}&nbsp;</span>
          <span className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal command"
              className="peer w-full bg-transparent text-bone caret-transparent outline-none"
            />
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 whitespace-pre opacity-40 peer-focus:opacity-100">
              <span className="invisible">{input}</span>
              <span className="blink inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-bone" />
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}
