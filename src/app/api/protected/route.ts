import { AuthContext, withAuthHandler } from "@/lib/api";

async function getHandler(request: Request, context: AuthContext) {
  // Your protected API logic here
  const data = { message: "Protected data", user: context.user };
  return Response.json(data);
}

async function postHandler(request: Request) {
  // Your protected API logic here
  const data = { message: "Protected data" };
  return Response.json(data);
}

export const GET = withAuthHandler(getHandler);
export const POST = withAuthHandler(postHandler);
