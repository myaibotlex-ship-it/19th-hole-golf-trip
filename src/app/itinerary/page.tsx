import { PageHeader } from "../components/PageHeader";

const flights = [
  { who: "Dan & Mike", airline: "Alaska AS 302", depart: "Jul 15, 6:15 AM — SEA", arrive: "Jul 15, 8:42 AM — OTH", conf: "BKRN7F" },
  { who: "Chris & Jake", airline: "United UA 1184", depart: "Jul 15, 7:00 AM — SFO", arrive: "Jul 15, 9:25 AM — OTH", conf: "XK29TL" },
  { who: "Tom & Will", airline: "Delta DL 445", depart: "Jul 15, 10:30 AM — LAX", arrive: "Jul 15, 1:05 PM — OTH", conf: "DL88MV" },
  { who: "Dan & Mike", airline: "Alaska AS 307", depart: "Jul 20, 3:15 PM — OTH", arrive: "Jul 20, 5:40 PM — SEA", conf: "BKRN7F" },
  { who: "Chris & Jake", airline: "United UA 1189", depart: "Jul 20, 4:00 PM — OTH", arrive: "Jul 20, 6:30 PM — SFO", conf: "XK29TL" },
  { who: "Tom & Will", airline: "Delta DL 448", depart: "Jul 20, 5:10 PM — OTH", arrive: "Jul 20, 7:45 PM — LAX", conf: "DL88MV" },
];

const schedule = [
  {
    day: "Day 0 — Tue, Jul 15",
    events: [
      { time: "Morning", activity: "Flights arrive at North Bend (OTH)", detail: "Shuttle to resort" },
      { time: "1:00 PM", activity: "Check-in at Bandon Dunes Lodge", detail: "Rooms assigned" },
      { time: "3:00 PM", activity: "Practice round — Shorty\u2019s (par 3)", detail: "Warm-up, bets set" },
      { time: "6:30 PM", activity: "Welcome dinner — The Bunker", detail: "Draft order & rules review" },
    ],
  },
  {
    day: "Day 1 — Wed, Jul 16",
    events: [
      { time: "7:00 AM", activity: "Breakfast — Trail\u2019s End", detail: "" },
      { time: "8:30 AM", activity: "Round 1 — Bandon Dunes Course", detail: "Individual stroke play" },
      { time: "1:30 PM", activity: "Lunch at the turn", detail: "" },
      { time: "6:00 PM", activity: "Dinner — Pacific Grill", detail: "Day 1 standings" },
      { time: "8:30 PM", activity: "19th Hole — Whiskey & cards", detail: "McKee\u2019s Pub" },
    ],
  },
  {
    day: "Day 2 — Thu, Jul 17",
    events: [
      { time: "7:00 AM", activity: "Breakfast — Trail\u2019s End", detail: "" },
      { time: "8:00 AM", activity: "Round 2 — Pacific Dunes", detail: "Best ball, teams drawn" },
      { time: "1:00 PM", activity: "Lunch at the Preserve", detail: "" },
      { time: "3:00 PM", activity: "Free time — spa, putting contest", detail: "Optional" },
      { time: "7:00 PM", activity: "Steak night — The Gallery", detail: "Closest-to-the-pin awards" },
    ],
  },
  {
    day: "Day 3 — Fri, Jul 18",
    events: [
      { time: "6:30 AM", activity: "Breakfast — early tee", detail: "" },
      { time: "7:30 AM", activity: "Round 3 — Old Macdonald", detail: "Final round, alt-shot pairs" },
      { time: "12:30 PM", activity: "Lunch & final scoring", detail: "" },
      { time: "3:00 PM", activity: "Trophy ceremony", detail: "The 19th Hole Cup awarded" },
      { time: "7:00 PM", activity: "Closing dinner & roasts", detail: "Black tie optional" },
    ],
  },
  {
    day: "Day 4 — Sat, Jul 19",
    events: [
      { time: "9:00 AM", activity: "Leisure morning", detail: "Beach walk, coffee" },
      { time: "11:00 AM", activity: "Optional: Sheep Ranch (9 holes)", detail: "Walking only" },
      { time: "2:00 PM", activity: "Pack & recover", detail: "" },
      { time: "6:00 PM", activity: "Farewell dinner — Bandon Fish Market", detail: "Town trip" },
    ],
  },
  {
    day: "Day 5 — Sun, Jul 20",
    events: [
      { time: "8:00 AM", activity: "Breakfast & checkout", detail: "" },
      { time: "10:00 AM", activity: "Shuttle to OTH airport", detail: "" },
      { time: "Afternoon", activity: "Flights depart", detail: "See flight table" },
    ],
  },
];

export default function ItineraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Schedule"
        title="Itinerary"
        subtitle="Five days, three rounds, and a hundred stories. Here\u2019s how it unfolds."
      />

      {/* Flights */}
      <section className="section">
        <div className="container-base">
          <p className="eyebrow mb-4">Flights</p>
          <div className="overflow-x-auto">
            <table className="brand-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>Flight</th>
                  <th>Depart</th>
                  <th>Arrive</th>
                  <th>Conf #</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f, i) => (
                  <tr key={i}>
                    <td className="font-semibold whitespace-nowrap">{f.who}</td>
                    <td className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--text-xs)]">{f.airline}</td>
                    <td className="whitespace-nowrap">{f.depart}</td>
                    <td className="whitespace-nowrap">{f.arrive}</td>
                    <td className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)]">{f.conf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Day-by-day Schedule */}
      {schedule.map((day) => (
        <section key={day.day} className="section">
          <div className="container-base">
            <h2
              className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-xl)] mb-6 leading-[1.1]"
              style={{ color: "var(--fg-primary)" }}
            >
              {day.day}
            </h2>
            <div className="overflow-x-auto">
              <table className="brand-table">
                <thead>
                  <tr>
                    <th style={{ width: "120px" }}>Time</th>
                    <th>Activity</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {day.events.map((e, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap font-semibold">{e.time}</td>
                      <td>{e.activity}</td>
                      <td style={{ color: "var(--fg-muted)" }}>{e.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
