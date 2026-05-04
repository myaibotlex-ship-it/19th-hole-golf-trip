import { PageHeader } from "../components/PageHeader";

type Round = {
  period: string;
  course: string;
  teeTimes: string;
  cost: string;
  notes?: string;
  pending?: boolean;
};

type DaySchedule = {
  date: string;
  label: string;
  rounds: Round[];
};

const lodging = [
  {
    name: "Black Desert Resort",
    location: "St. George, UT",
    checkin: "Wed Jun 3",
    checkout: "Thu Jun 4",
    nights: "1 night",
    detail: "4 rooms, 2 queens each",
    paid: "$1,489.76 — paid by Dan",
  },
  {
    name: "House Rental",
    location: "St. George, UT",
    checkin: "Wed Jun 3",
    checkout: "Sat Jun 6",
    nights: "3 nights",
    detail: "Full group",
    paid: "$2,971.93 — paid by Dan",
  },
];

const schedule: DaySchedule[] = [
  {
    date: "Wed, Jun 3",
    label: "Day 1",
    rounds: [
      {
        period: "Afternoon",
        course: "Black Desert Golf Course",
        teeTimes: "1:12 PM · 1:24 PM",
        cost: "$350/person — pay individually",
        notes: "Includes carts, fore caddie, NA food & practice facility",
      },
      {
        period: "Evening",
        course: "Dinner at Basalt",
        teeTimes: "7:30 PM",
        cost: "Reservation for 8 — under David McClain",
        notes: "1500 East Black Desert Drive, Ivins, UT 84738. Confirmation: KKJSJ4G5NWX. 15-minute grace period; entire party must be present before table is released.",
      },
    ],
  },
  {
    date: "Thu, Jun 4",
    label: "Day 2",
    rounds: [
      {
        period: "Morning",
        course: "The Ledges Golf Club",
        teeTimes: "8:00 AM · 8:10 AM",
        cost: "Prepaid by Dan — $1,033.34 total",
      },
      {
        period: "Afternoon",
        course: "Entrada at Snow Canyon",
        teeTimes: "TBD",
        cost: "TBD",
        notes: "Target afternoon round if available.",
        pending: true,
      },
      {
        period: "Afternoon Backup",
        course: "The Ledges Golf Club Replay",
        teeTimes: "1:20 PM · 1:30 PM",
        cost: "$649.04 total — paid by Dan",
        notes: "Placeholder reservation for 8 players. Use only if Entrada at Snow Canyon does not work out. Booking IDs: 6A9K-1J3K and 3P8Q-2H6P.",
      },
    ],
  },
  {
    date: "Fri, Jun 5",
    label: "Day 3",
    rounds: [
      {
        period: "Morning",
        course: "Wolf Creek Golf Club",
        teeTimes: "10:00 AM · 10:10 AM",
        cost: "$225/person — pay at course",
      },
    ],
  },
  {
    date: "Sat, Jun 6",
    label: "Day 4",
    rounds: [
      {
        period: "Morning",
        course: "Sand Hollow Golf Course",
        teeTimes: "7:42 AM · 7:53 AM",
        cost: "$1,066 total at course — pay individually",
      },
      {
        period: "Afternoon",
        course: "Copper Rock Golf Course",
        teeTimes: "2:00 PM · 2:12 PM",
        cost: "$295/person — card hold on file",
        notes: "Confirmed with Jon Fuller, PGA. Address: 1567 W. Copper Rock Parkway, Hurricane, UT 84737.",
      },
    ],
  },
];

function GolfFlag() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 22 L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 4 Q14 5 18 7 Q14 9 8 10 Z" fill="currentColor" />
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function ItineraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="June 3–7, 2026"
        title="Itinerary"
        subtitle="Six rounds across four days. St. George, Utah."
      />

      {/* Lodging */}
      <section className="section">
        <div className="container-base">
          <p className="eyebrow mb-6">Lodging</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            {lodging.map((l) => (
              <div key={l.name} className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3
                      className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-lg)] leading-tight mb-1"
                      style={{ color: "var(--fg-primary)" }}
                    >
                      {l.name}
                    </h3>
                    <p
                      className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase text-[length:var(--text-3xs)] tracking-[0.16em]"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {l.location}
                    </p>
                  </div>
                  <span className="tag tag-sage flex-shrink-0">{l.nights}</span>
                </div>
                <div className="space-y-2">
                  <p
                    className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)]"
                    style={{ color: "var(--fg-secondary)" }}
                  >
                    Check-in: <strong>{l.checkin}</strong> &rarr; Check-out: <strong>{l.checkout}</strong>
                  </p>
                  <p
                    className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)]"
                    style={{ color: "var(--fg-secondary)" }}
                  >
                    {l.detail}
                  </p>
                  <p
                    className="font-[family-name:var(--font-eyebrow)] text-[length:var(--text-3xs)] uppercase tracking-[0.12em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {l.paid}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="font-[family-name:var(--font-body)] text-[length:var(--text-xs)] italic"
            style={{ color: "var(--fg-muted)" }}
          >
            Both properties check in Jun 3. The group splits the first night — some at Black Desert Resort, remainder at the house. Full group moves to the house from Jun 4.
          </p>
        </div>
      </section>

      {/* Round-by-day schedule */}
      {schedule.map((day) => (
        <section key={day.date} className="section">
          <div className="container-base">
            <div className="flex items-baseline gap-4 mb-6">
              <p className="eyebrow">{day.label}</p>
              <h2
                className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-xl)] leading-tight"
                style={{ color: "var(--fg-primary)" }}
              >
                {day.date}
              </h2>
            </div>

            <div className="space-y-4">
              {day.rounds.map((round) => (
                <div key={round.course} className="card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span style={{ color: "var(--accent)", marginTop: "3px", flexShrink: 0 }}>
                        <GolfFlag />
                      </span>
                      <div>
                        <h3
                          className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-lg)] leading-tight mb-1"
                          style={{ color: "var(--fg-primary)" }}
                        >
                          {round.course}
                        </h3>
                        <div className="flex flex-wrap gap-3 items-center">
                          <span
                            className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase text-[length:var(--text-3xs)] tracking-[0.12em]"
                            style={{ color: "var(--fg-muted)" }}
                          >
                            {round.period}
                          </span>
                          {round.teeTimes !== "TBD" && (
                            <span
                              className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)]"
                              style={{ color: "var(--fg-secondary)" }}
                            >
                              {round.teeTimes}
                            </span>
                          )}
                          {round.pending && (
                            <span className="tag tag-gold">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="font-[family-name:var(--font-eyebrow)] font-semibold text-[length:var(--text-xs)] uppercase tracking-[0.08em]"
                        style={{ color: round.pending ? "var(--fg-muted)" : "var(--fg-primary)" }}
                      >
                        {round.cost}
                      </p>
                      {round.notes && (
                        <p
                          className="font-[family-name:var(--font-body)] text-[length:var(--text-xs)] italic mt-1"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          {round.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
