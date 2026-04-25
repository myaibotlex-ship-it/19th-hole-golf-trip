import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Merch — The 19th Hole",
};

const merchItems = [
  {
    name: "The Classic Polo",
    description: "Forest green performance polo with embroidered 19th Hole monogram on chest. Moisture-wicking. Made for the links.",
    price: "$65",
    badge: "Best Seller",
    logo: "/assets/assets/logo-monogram.png",
  },
  {
    name: "The Fairway Tee",
    description: "Soft cotton tee in ivory with full primary logo across the chest. The shirt you wear when you're not on the course.",
    price: "$35",
    badge: null,
    logo: "/assets/assets/logo-primary.png",
  },
  {
    name: "The Clubhouse Cap",
    description: "Structured mid-crown cap in navy with embroidered secondary badge. Adjustable leather strap. One size.",
    price: "$40",
    badge: "New",
    logo: "/assets/assets/logo-secondary.png",
  },
  {
    name: "The Members Hat",
    description: "Relaxed fit dad hat in sand with tone-on-tone monogram. Low profile, brass buckle closure.",
    price: "$38",
    badge: null,
    logo: "/assets/assets/logo-monogram.png",
  },
  {
    name: "The Lucky Ball Marker Set",
    description: "Set of three brass ball markers featuring the monogram, badge, and flag glyph. Magnetic hat clip included.",
    price: "$28",
    badge: "Limited",
    logo: "/assets/assets/logo-monogram.png",
  },
  {
    name: "The Scorecard Wallet",
    description: "Full-grain leather scorecard wallet in forest green. Embossed secondary logo. Holds cards, tees, and a pencil.",
    price: "$55",
    badge: null,
    logo: "/assets/assets/logo-secondary.png",
  },
];

export default function MerchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pro Shop"
        title="The Merch"
        subtitle="Gear for the members. Worn on and off the course."
      />

      <section className="section">
        <div className="container-base">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-5)",
            }}
          >
            {merchItems.map((item) => (
              <div key={item.name} className="card" style={{ display: "flex", flexDirection: "column" }}>
                {/* Placeholder image area with logo */}
                <div
                  style={{
                    background: "var(--bg-inset)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "220px",
                    marginBottom: "var(--space-5)",
                    position: "relative",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{ opacity: 0.5 }}
                  />
                  {item.badge && (
                    <span
                      className="tag"
                      style={{
                        position: "absolute",
                        top: "var(--space-3)",
                        right: "var(--space-3)",
                        background: item.badge === "Best Seller" ? "var(--accent)" : item.badge === "New" ? "var(--color-sage)" : "transparent",
                        color: item.badge === "Limited" ? "var(--accent)" : item.badge === "New" ? "white" : "var(--fg-on-gold)",
                        border: item.badge === "Limited" ? "1px solid var(--accent)" : "none",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "var(--text-lg)",
                      color: "var(--fg-primary)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-xs)",
                      color: "var(--fg-muted)",
                      lineHeight: "var(--leading-normal)",
                      flex: 1,
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {item.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-3)" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "var(--text-lg)",
                        color: "var(--fg-primary)",
                      }}
                    >
                      {item.price}
                    </span>
                    <button className="btn-primary" style={{ fontSize: "var(--text-3xs)", padding: "var(--space-2) var(--space-4)" }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
