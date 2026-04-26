export const ATTENDEES = [
  { slug: "dan-rackley",      firstName: "Dan",    fullName: "Dan Rackley" },
  { slug: "david-mcclain",    firstName: "David",  fullName: "David McClain" },
  { slug: "ryan-blake",       firstName: "Ryan",   fullName: "Ryan Blake" },
  { slug: "casey-costa",      firstName: "Casey",  fullName: "Casey Costa" },
  { slug: "ryan-roth",        firstName: "Ryan",   fullName: "Ryan Roth" },
  { slug: "grant-anderson",   firstName: "Grant",  fullName: "Grant Anderson" },
  { slug: "casper-heuckroth", firstName: "Casper", fullName: "Casper Heuckroth" },
  { slug: "eric-mehrten",     firstName: "Eric",   fullName: "Eric Mehrten" },
] as const;

export type AttendeeSlug = (typeof ATTENDEES)[number]["slug"];

export const ADMIN_SLUG = "dan-rackley" as const satisfies AttendeeSlug;

const SLUG_SET = new Set<string>(ATTENDEES.map((a) => a.slug));

export function isValidSlug(value: unknown): value is AttendeeSlug {
  return typeof value === "string" && SLUG_SET.has(value);
}

export function isAdmin(slug: string | undefined | null): boolean {
  return slug === ADMIN_SLUG;
}

export function getAttendee(slug: string): (typeof ATTENDEES)[number] | undefined {
  return ATTENDEES.find((a) => a.slug === slug);
}
