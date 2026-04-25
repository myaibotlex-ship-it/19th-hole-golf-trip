import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="relative z-1 border-t py-12"
      style={{ borderColor: "var(--border-subtle)", background: "var(--bg-page)" }}
    >
      <div className="container-base text-center">
        <Image
          src="/assets/assets/logo-secondary.png"
          alt="The 19th Hole badge"
          width={80}
          height={80}
          className="mx-auto mb-4 object-contain opacity-70"
        />
        <p
          className="font-[family-name:var(--font-display)] italic text-[length:var(--text-md)] mb-2"
          style={{ color: "var(--fg-secondary)" }}
        >
          Lost Balls. Found Memories.
        </p>
        <p
          className="font-[family-name:var(--font-eyebrow)] uppercase tracking-[0.16em] text-[length:var(--text-3xs)]"
          style={{ color: "var(--fg-muted)" }}
        >
          The 19th Hole &middot; Golf Trip Club &middot; Est. 2026
        </p>
      </div>
    </footer>
  );
}
