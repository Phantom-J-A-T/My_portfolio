import { FileText } from "lucide-react";
import { PROFILE } from "../data";
import { DitherImage } from "../lib/DitherImage";
import { EmailButton } from "../lib/EmailButton";
import { Scramble } from "../lib/Scramble";
import { GithubIcon, LinkedinIcon, XIcon } from "../lib/icons";

export function ProfileTile() {
  const { links } = PROFILE;
  const socials = [
    { href: links.github, label: "GitHub", Icon: GithubIcon },
    { href: links.x, label: "X", Icon: XIcon },
    { href: links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ];

  return (
    <article className="tile decrypt p-6" data-scramble-host>
      <div className="flex items-start justify-between">
        <DitherImage
          src={PROFILE.avatar}
          alt={`${PROFILE.name}'s avatar: a hooded figure in a cap and mask`}
          cell={2}
          contrast={1.6}
          brightness={0.12}
          focus={[0.6, 0.4]}
          className="h-[76px] w-[76px] rounded-[14px]"
        />
        {PROFILE.available && (
          <span className="label flex items-center gap-3">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-bone" />
            Open to work
          </span>
        )}
      </div>

      <h1 className="mt-6">
        <Scramble text={PROFILE.name} className="display block text-[34px] text-bone" />
      </h1>
      <p className="mono mt-2 text-[13px] text-ash">@{PROFILE.handle}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ash">{PROFILE.intro}</p>

      <div className="mt-6 flex items-center gap-2">
        {socials.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="pill icon-btn"
            aria-label={label}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
        {links.cv && (
          <a href={links.cv} className="pill" target="_blank" rel="noreferrer">
            <FileText className="h-4 w-4" aria-hidden />
            CV
          </a>
        )}
      </div>
      <EmailButton className="mt-3" />
    </article>
  );
}
