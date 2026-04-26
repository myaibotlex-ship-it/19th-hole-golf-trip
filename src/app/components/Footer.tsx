import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="relative z-1"
      style={{ background: "var(--color-forest)", color: "var(--color-ivory)" }}
    >
      <div className="container-base" style={{ padding: "var(--space-8) var(--space-5) var(--space-7)" }}>
        {/* Two-column: mark + closing quote */}
        <div
          className="grid gap-6 items-center"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <div className="flex items-center gap-4">
            <Image
              src="/assets/assets/logo-monogram.png"
              alt="The 19th Hole monogram"
              width={64}
              height={64}
              className="object-contain flex-shrink-0"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.95 }}
            />
            <div>
              <div
                className="font-[family-name:var(--font-display)] font-bold uppercase leading-none"
                style={{
                  fontSize: "var(--text-xl)",
                  letterSpacing: "-0.01em",
                  color: "var(--color-ivory)",
                }}
              >
                The{" "}
                <span style={{ color: "var(--color-gold)" }}>19th</span>{" "}
                Hole
              </div>
              <div
                className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase mt-1"
                style={{
                  fontSize: "var(--text-3xs)",
                  letterSpacing: "var(--tracking-wider)",
                  color: "var(--color-sand)",
                }}
              >
                Golf Trip Club &middot; Est. 2026
              </div>
            </div>
          </div>

          <p
            className="font-[family-name:var(--font-display)] italic text-right"
            style={{ fontSize: "var(--text-md)", color: "var(--color-sand)", fontWeight: 400 }}
          >
            &ldquo;Good rounds. Great company.&rdquo;
          </p>
        </div>

        {/* Meta row */}
        <div
          className="flex justify-between items-center mt-7 pt-4 uppercase"
          style={{
            borderTop: "1px solid rgba(243, 239, 230, 0.15)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-3xs)",
            color: "rgba(243, 239, 230, 0.55)",
            letterSpacing: "var(--tracking-wider)",
          }}
        >
          <span>The 19th Hole &middot; 2026</span>
          <span>Lost Balls &middot; Found Memories</span>
          <a href="/api/logout" className="footer-sign-out">
            Sign Out
          </a>
        </div>
      </div>
    </footer>
  );
}
