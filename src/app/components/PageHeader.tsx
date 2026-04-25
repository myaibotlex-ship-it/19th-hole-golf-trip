export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="py-16 md:py-20 text-center" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
      <div className="container-base">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1
          className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-3xl)] md:text-[length:var(--text-4xl)] leading-[1.1] tracking-[-0.02em] mb-5"
          style={{ color: "var(--fg-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-[family-name:var(--font-body)] text-[length:var(--text-md)] leading-[1.7] max-w-[56ch] mx-auto"
            style={{ color: "var(--fg-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
