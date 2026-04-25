import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "RSVP — The 19th Hole",
};

export default function RSVPPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roll Call"
        title="Reserve Your Spot"
        subtitle="The tee sheet waits for no one. Confirm your place."
      />

      <section className="section">
        <div className="container-narrow">
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
              <div>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="Jack" />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Nicklaus" />
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="jack@thegoldengrip.com" />
            </div>

            <div>
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" placeholder="(555) 867-5309" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
              <div>
                <label htmlFor="handicap">Handicap Index</label>
                <input type="number" id="handicap" name="handicap" placeholder="12" />
              </div>
              <div>
                <label htmlFor="shirtSize">Shirt Size</label>
                <select id="shirtSize" name="shirtSize" defaultValue="">
                  <option value="" disabled>Select size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">X-Large</option>
                  <option value="XXL">XX-Large</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dietary">Dietary Restrictions</label>
              <input type="text" id="dietary" name="dietary" placeholder="None" />
            </div>

            <div>
              <label htmlFor="notes">Notes for the Group</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Arriving late Thursday, need a ride from the airport, etc."
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
              <button type="submit" className="btn-primary">
                Confirm RSVP
              </button>
              <button type="reset" className="btn-ghost">
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
