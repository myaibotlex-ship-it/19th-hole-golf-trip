import { cookies } from "next/headers";
import { getAttendee } from "@/lib/attendees";
import { IdentifyForm } from "./IdentifyForm";

export default async function IdentifyPage() {
  const cookieStore = await cookies();
  const slug = cookieStore.get("gh19_user")?.value ?? null;
  // Only pass valid slugs — invalid values are treated as no selection
  const currentSlug = slug && getAttendee(slug) ? slug : null;
  return <IdentifyForm currentSlug={currentSlug} />;
}
