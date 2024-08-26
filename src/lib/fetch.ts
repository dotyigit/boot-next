import { cookies } from "next/headers";
import { validateRequest } from "./auth";
import { redirect } from "next/navigation";

export default async function fetchData(path: string, tag: string) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  // Check if the user is authenticated
  const { session } = await validateRequest();

  if (!session) {
    return redirect("/login");
  }

  // Sanitize the path to prevent issues with multiple or missing slashes
  const sanitizedPath = path.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");

  // Construct the URL, ensuring there's exactly one slash between API_URL and the path
  const url = `${process.env.NEXT_PUBLIC_API_URL.replace(
    /\/+$/,
    ""
  )}/${sanitizedPath}`;

  const res = await fetch(url, {
    cache: "no-store",
    next: { tags: [tag] },
    headers: {
      cookie: cookies().toString(),
    },
  });

  if (!res.ok) {
    return redirect("/login");
  }

  return res.json();
}
