"use client";

import { useState, type FormEvent } from "react";
import { PageHeader } from "../components/PageHeader";

export default function RSVPPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="You're In"
          title="See You There"
          subtitle="We'll raise a glass in your honor. Details incoming."
        />
        <section className="section">
          <div className="container-narrow text-center">
            <div className="card py-12">
              <p
                className="font-[family-name:var(--font-display)] italic text-[length:var(--text-xl)] mb-4"
                style={{ color: "var(--fg-primary)" }}
              >
                &ldquo;Any course. Every year.&rdquo;
              </p>
              <p style={{ color: "var(--fg-muted)" }}>
                Your RSVP has been recorded. Check your email for confirmation.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Join the Tradition"
        title="RSVP"
        subtitle="Confirm your spot for the 2026 trip. Spaces are limited to the inner circle."
      />

      <section className="section">
        <div className="container-narrow">
          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required placeholder="e.g. Dan Rackley" />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="dan@example.com" />
              </div>
              <div>
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label htmlFor="handicap">Handicap</label>
                <input type="number" id="handicap" name="handicap" min={0} max={54} placeholder="e.g. 14" />
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="shirt">Shirt Size</label>
              <select id="shirt" name="shirt" defaultValue="">
                <option value="" disabled>Select size</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
              </select>
            </div>

            <div className="mb-8">
              <label htmlFor="dietary">Dietary Restrictions</label>
              <input type="text" id="dietary" name="dietary" placeholder="None, vegetarian, gluten-free, etc." />
            </div>

            <div className="mb-8">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Anything we should know \u2014 roommate preference, travel notes, trash talk..."
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                Confirm RSVP
              </button>
              <button type="reset" className="btn-ghost">
                Clear
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
