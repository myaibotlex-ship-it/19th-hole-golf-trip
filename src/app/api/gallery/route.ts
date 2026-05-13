import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAttendee } from "@/lib/attendees";

const BUCKET = "golf-trip-photos";
const FOLDER = "st-george-2026";
const ADMIN_SLUG = "dan-rackley";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/gallery — list all photos with metadata
export async function GET(): Promise<NextResponse> {
  const supabase = getServiceClient();

  // List files in st-george-2026/
  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list(FOLDER, { limit: 200, offset: 0, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!files || files.length === 0) {
    return NextResponse.json({ ok: true, items: [] });
  }

  // Fetch metadata from our table
  const paths = files.map((f) => `${FOLDER}/${f.name}`);
  const { data: metas } = await supabase
    .from("golf_gallery_meta")
    .select("*")
    .in("storage_path", paths);

  const metaMap = new Map((metas ?? []).map((m) => [m.storage_path, m]));

  const items = files
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const path = `${FOLDER}/${f.name}`;
      const meta = metaMap.get(path);
      const publicUrl = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path).data.publicUrl;

      return {
        path,
        name: f.name,
        url: publicUrl,
        uploader_slug: meta?.uploader_slug ?? null,
        uploader_name: meta?.uploader_name ?? null,
        caption: meta?.caption ?? f.name.replace(/\.[^.]+$/, "").replace(/_/g, " "),
        uploaded_at: meta?.uploaded_at ?? f.created_at,
      };
    });

  return NextResponse.json({ ok: true, items });
}

// POST /api/gallery — upload a photo
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check site auth
  const authCookie = request.cookies.get("gh19_auth");
  if (authCookie?.value !== "valid") {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const userSlug = request.cookies.get("gh19_user")?.value;
  const attendee = userSlug ? getAttendee(userSlug) : null;
  const uploaderSlug = attendee?.slug ?? "unknown";
  const uploaderName = attendee?.fullName ?? "Guest";

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const caption = (formData.get("caption") as string) || "";

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  // Generate unique filename
  const originalName = (file as File).name ?? "upload";
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
  const timestamp = Date.now();
  const safe = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);
  const fileName = `${timestamp}_${uploaderSlug}_${safe}.${ext}`;
  const storagePath = `${FOLDER}/${fileName}`;

  const supabase = getServiceClient();

  // Upload to storage
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  // Store metadata
  await supabase.from("golf_gallery_meta").insert({
    storage_path: storagePath,
    uploader_slug: uploaderSlug,
    uploader_name: uploaderName,
    caption: caption || originalName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
    uploaded_at: new Date().toISOString(),
  });

  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;

  return NextResponse.json({
    ok: true,
    item: {
      path: storagePath,
      name: fileName,
      url: publicUrl,
      uploader_slug: uploaderSlug,
      uploader_name: uploaderName,
      caption: caption || originalName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
      uploaded_at: new Date().toISOString(),
    },
  });
}

// DELETE /api/gallery — delete a photo (admin only)
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  // Admin check
  const authCookie = request.cookies.get("gh19_auth");
  if (authCookie?.value !== "valid") {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const userSlug = request.cookies.get("gh19_user")?.value;
  if (userSlug !== ADMIN_SLUG) {
    return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });
  }

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { path } = body;
  if (!path || typeof path !== "string" || !path.startsWith(`${FOLDER}/`)) {
    return NextResponse.json({ ok: false, error: "Invalid path" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Remove metadata
  await supabase.from("golf_gallery_meta").delete().eq("storage_path", path);

  return NextResponse.json({ ok: true });
}
