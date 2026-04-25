import Image from "next/image";
import { PageHeader } from "../components/PageHeader";

const products = [
  {
    name: "The Classic Tee",
    description: "Soft cotton crew with the primary wordmark across the chest. Forest on ivory.",
    price: "$38",
    category: "Apparel",
    colors: ["Ivory", "Forest", "Navy"],
    image: "/assets/assets/logo-primary.png",
    badge: "Best Seller",
  },
  {
    name: "The Badge Polo",
    description: "Moisture-wicking performance polo with embroidered badge logo on left chest.",
    price: "$62",
    category: "Apparel",
    colors: ["Forest", "Navy", "Sand"],
    image: "/assets/assets/logo-secondary.png",
    badge: null,
  },
  {
    name: "The Monogram Cap",
    description: "Structured six-panel cap with the 19 monogram front and center. Adjustable strap.",
    price: "$34",
    category: "Headwear",
    colors: ["Forest", "Navy", "Ivory"],
    image: "/assets/assets/logo-monogram.png",
    badge: "New",
  },
  {
    name: "The Tradition Hat",
    description: "Rope-front snapback with secondary badge patch. Classic links look.",
    price: "$36",
    category: "Headwear",
    colors: ["Forest", "Sand"],
    image: "/assets/assets/logo-secondary.png",
    badge: null,
  },
  {
    name: "19th Hole Golf Balls",
    description: "Titleist Pro V1 sleeve (3-pack) custom printed with the monogram. Lost ball insurance not included.",
    price: "$18",
    category: "Gear",
    colors: ["White"],
    image: "/assets/assets/logo-monogram.png",
    badge: "Limited",
  },
  {
    name: "The Divot Tool",
    description: "Brass divot repair tool with engraved monogram and magnetic ball marker.",
    price: "$22",
    category: "Gear",
    colors: ["Brass"],
    image: "/assets/assets/logo-monogram.png",
    badge: null,
  },
  {
    name: "The Duffel",
    description: "Waxed canvas weekender with leather handles and embossed badge. Built for the trip.",
    price: "$128",
    category: "Bags",
    colors: ["Forest", "Sand"],
    image: "/assets/assets/logo-secondary.png",
    badge: "Premium",
  },
  {
    name: "The Flask",
    description: "6 oz stainless flask with laser-etched monogram. For the 19th hole, naturally.",
    price: "$28",
    category: "Gear",
    colors: ["Matte Black", "Brass"],
    image: "/assets/assets/logo-monogram.png",
    badge: null,
  },
];

export default function MerchPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Pro Shop"
        title="Merchandise"
        subtitle="Gear up for the trip. Every piece carries the mark of the 19th Hole."
      />

      <section className="section">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.name} className="card flex flex-col">
                {/* Product Image Area */}
                <div
                  className="relative aspect-square flex items-center justify-center mb-4 rounded-sm"
                  style={{ background: "var(--bg-inset)" }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={140}
                    height={140}
                    className="object-contain opacity-80"
                  />
                  {product.badge && (
                    <span className="absolute top-3 right-3 tag tag-sage">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Category */}
                <p className="eyebrow mb-1 text-[length:var(--text-3xs)]">{product.category}</p>

                {/* Name */}
                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-md)] mb-2 leading-[1.2]"
                  style={{ color: "var(--fg-primary)" }}
                >
                  {product.name}
                </h3>

                {/* Description */}
                <p
                  className="font-[family-name:var(--font-body)] text-[length:var(--text-xs)] mb-4 flex-1"
                  style={{ color: "var(--fg-secondary)", lineHeight: "1.6" }}
                >
                  {product.description}
                </p>

                {/* Color Options */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.colors.map((c) => (
                    <span key={c} className="tag tag-gold text-[length:var(--text-3xs)] py-0">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <span
                    className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-lg)]"
                    style={{ color: "var(--fg-primary)" }}
                  >
                    {product.price}
                  </span>
                  <button className="btn-primary text-[length:var(--text-3xs)] py-2 px-4">
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-10 text-center py-8">
            <p className="eyebrow mb-2">Custom Orders</p>
            <p
              className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] max-w-[48ch] mx-auto"
              style={{ color: "var(--fg-secondary)" }}
            >
              Want something custom? Monogrammed towels, headcovers, or engraved items &mdash; reach out and we&rsquo;ll make it happen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
