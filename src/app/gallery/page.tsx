"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { PageHeader } from "../components/PageHeader";

const ADMIN_SLUG = "dan-rackley";

interface GalleryItem {
  path: string;
  name: string;
  url: string;
  uploader_slug: string | null;
  uploader_name: string | null;
  caption: string;
  uploaded_at: string | null;
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // path to confirm
  const [userSlug, setUserSlug] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Read user identity from cookies (client-side)
  useEffect(() => {
    // We can't read httpOnly cookies client-side — use a lightweight identify check
    fetch("/api/identify/me")
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((data) => {
        if (data?.slug) {
          setUserSlug(data.slug);
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
        }
      })
      .catch(() => setIsAuthed(false));
  }, []);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.ok) setItems(data.items ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("caption", file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
        const res = await fetch("/api/gallery", { method: "POST", body: fd });
        const data = await res.json();
        if (!data.ok) {
          setUploadError(data.error ?? "Upload failed");
          break;
        }
        // Optimistically add to list
        if (data.item) {
          setItems((prev) => [data.item, ...prev]);
        }
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (path: string) => {
    setDeleteConfirm(null);
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (data.ok) {
        setItems((prev) => prev.filter((i) => i.path !== path));
        // Close lightbox if deleted item was open
        if (lightbox !== null && items[lightbox]?.path === path) {
          setLightbox(null);
        }
      }
    } catch {
      // silently fail
    }
  };

  const isAdmin = userSlug === ADMIN_SLUG;

  return (
    <>
      <PageHeader
        eyebrow="St. George · 2026"
        title="Gallery"
        subtitle="Shots from the course and the clubhouse. Upload yours to the collection."
      />

      <section className="section">
        <div className="container-wide">

          {/* Upload Card */}
          <div className="card mb-8 text-center py-8">
            <p className="eyebrow mb-3">Add Photos</p>
            <p
              className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] mb-4"
              style={{ color: "var(--fg-secondary)" }}
            >
              Drop your best shots here. Golden hour encouraged.
            </p>
            {!isAuthed && !loading ? (
              <p style={{ color: "var(--fg-muted)", fontSize: "var(--text-xs)" }}>
                <a href="/identify" style={{ color: "var(--color-gold)" }}>Identify yourself</a> to upload photos.
              </p>
            ) : (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                  id="gallery-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="gallery-upload"
                  className="btn-primary cursor-pointer inline-flex gap-2"
                  style={{ opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? "none" : "auto" }}
                >
                  <UploadIcon />
                  {uploading ? "Uploading…" : "Choose Photos"}
                </label>
                {uploadError && (
                  <p style={{ color: "var(--status-error)", marginTop: "0.75rem", fontSize: "var(--text-xs)" }}>
                    {uploadError}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Album header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="tag tag-forest">St. George 2026</span>
            <span className="gold-rule" style={{ flex: 1 }} />
            <span style={{ color: "var(--fg-muted)", fontSize: "var(--text-xs)", fontFamily: "var(--font-eyebrow)" }}>
              {loading ? "Loading…" : `${items.length} photo${items.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square"
                  style={{ background: "var(--bg-inset)", border: "1px solid var(--border-subtle)", animation: "pulse 1.5s infinite" }}
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="card py-16 text-center">
              <p className="eyebrow mb-3" style={{ opacity: 0.5 }}>No Photos Yet</p>
              <p style={{ color: "var(--fg-muted)", fontSize: "var(--text-sm)" }}>
                Be the first to upload a shot from the trip.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item, i) => (
                <div key={item.path} className="relative group">
                  <button
                    onClick={() => setLightbox(i)}
                    className="relative aspect-square overflow-hidden w-full cursor-pointer"
                    style={{
                      background: "var(--bg-inset)",
                      border: "1px solid var(--border-subtle)",
                      display: "block",
                    }}
                  >
                    <Image
                      src={item.url}
                      alt={item.caption}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
                      style={{ background: "linear-gradient(transparent 40%, rgba(15,31,24,0.8))" }}
                    >
                      <span
                        className="font-[family-name:var(--font-eyebrow)] text-[length:var(--text-3xs)] uppercase tracking-[0.12em] text-white block"
                      >
                        {item.caption}
                      </span>
                      {item.uploader_name && (
                        <span style={{ color: "rgba(205,162,78,0.9)", fontSize: "var(--text-3xs)", fontFamily: "var(--font-eyebrow)", letterSpacing: "0.08em" }}>
                          {item.uploader_name}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Uploader attribution below thumbnail */}
                  {item.uploader_name && (
                    <p
                      style={{
                        fontSize: "var(--text-3xs)",
                        fontFamily: "var(--font-eyebrow)",
                        color: "var(--fg-muted)",
                        letterSpacing: "0.06em",
                        marginTop: "0.35rem",
                        paddingLeft: "2px",
                      }}
                    >
                      📷 {item.uploader_name}
                    </p>
                  )}

                  {/* Admin delete button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(item.path); }}
                      aria-label="Delete photo"
                      title="Delete photo"
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        background: "rgba(139,46,46,0.85)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px",
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="group-hover:!opacity-100"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,31,24,0.75)" }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="card max-w-sm w-full"
            style={{ background: "var(--bg-surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow mb-3" style={{ color: "var(--status-error)" }}>Delete Photo?</p>
            <p style={{ color: "var(--fg-secondary)", fontSize: "var(--text-sm)", marginBottom: "1.5rem" }}>
              This will permanently remove the photo from the gallery.
            </p>
            <div className="flex gap-3 justify-end">
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="btn-primary"
                style={{ background: "var(--status-error)" }}
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,31,24,0.93)" }}
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
          {lightbox < items.length - 1 && (
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
            className="relative max-w-4xl max-h-[80vh] w-full"
            style={{ aspectRatio: "4/3" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[lightbox].url}
              alt={items[lightbox].caption}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Caption + uploader */}
          <div className="absolute bottom-6 text-center">
            <p
              className="font-[family-name:var(--font-eyebrow)] text-[length:var(--text-2xs)] uppercase tracking-[0.16em] text-white/80"
            >
              {items[lightbox].caption}
            </p>
            {items[lightbox].uploader_name && (
              <p style={{ color: "var(--color-gold)", fontSize: "var(--text-3xs)", fontFamily: "var(--font-eyebrow)", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
                Uploaded by {items[lightbox].uploader_name}
              </p>
            )}

            {/* Admin delete from lightbox */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(null);
                  setDeleteConfirm(items[lightbox]?.path ?? null);
                }}
                className="btn-ghost-light mt-4 gap-2"
                style={{ borderColor: "rgba(139,46,46,0.7)", color: "rgba(255,180,180,0.9)" }}
              >
                <TrashIcon /> Delete Photo
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
