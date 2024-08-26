import { withRateLimitHandler } from "@/lib/api";

async function getHandler(request: Request) {
  // Your protected API logic here
  const data = { message: "Public data" };
  return Response.json(data);
}

export const GET = withRateLimitHandler(getHandler);
