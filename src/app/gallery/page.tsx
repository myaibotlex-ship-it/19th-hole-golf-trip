"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PageHeader } from "../components/PageHeader";

type GalleryImage = {
  src: string;
  caption: string;
};

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  { src: "/assets/uploads/19th hole brand kit.png", caption: "The brand kit — where it all started" },
  { src: "/assets/uploads/19th hole logo.png", caption: "Our mark on the green" },
  { src: "/assets/uploads/the_19th_hole_monogram_icon_est_2026.png", caption: "Monogram — est. 2026" },
  { src: "/assets/uploads/the_19th_hole_secondary_logo.png", caption: "The badge" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(PLACEHOLDER_IMAGES);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, { src: url, caption: file.name.replace(/\.[^.]+$/, "") }]);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <PageHeader
        eyebrow="The Memories"
        title="Gallery"
        subtitle="Shots from the course and the clubhouse. Upload yours to the collection."
      />

      <section className="section">
        <div className="container-wide">
          {/* Upload */}
          <div className="card mb-8 text-center py-8">
            <p className="eyebrow mb-3">Add Photos</p>
            <p
              className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] mb-4"
              style={{ color: "var(--fg-secondary)" }}
            >
              Drop your best shots here. Golden hour encouraged.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload" className="btn-primary cursor-pointer inline-flex">
              Choose Photos
            </label>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="relative aspect-square overflow-hidden group cursor-pointer"
                style={{
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
                  style={{ background: "linear-gradient(transparent 50%, rgba(15,31,24,0.7))" }}
                >
                  <span
                    className="font-[family-name:var(--font-eyebrow)] text-[length:var(--text-3xs)] uppercase tracking-[0.12em] text-white"
                  >
                    {img.caption}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,31,24,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white cursor-pointer"
            style={{ background: "none", border: "none" }}
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Nav arrows */}
          {lightbox > 0 && (
            <button
              className="absolute left-4 text-white cursor-pointer"
              style={{ background: "none", border: "none" }}
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              aria-label="Previous"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          {lightbox < images.length - 1 && (
            <button
              className="absolute right-4 text-white cursor-pointer"
              style={{ background: "none", border: "none" }}
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              aria-label="Next"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-4xl max-h-[80vh] w-full aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].caption}
              fill
              className="object-contain"
              sizes="80vw"
            />
          </div>
          <p
            className="absolute bottom-6 font-[family-name:var(--font-eyebrow)] text-[length:var(--text-2xs)] uppercase tracking-[0.16em] text-white/80"
          >
            {images[lightbox].caption}
          </p>
        </div>
      )}
    </>
  );
}
