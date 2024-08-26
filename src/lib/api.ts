import { validateRequest } from "./auth";
import { checkRateLimit } from "./rate-limit";
import { User, Session } from "@prisma/client"; // Adjust this import based on your actual User and Session types

export interface AuthContext {
  params: Record<string, string | string[]>;
  user: Omit<User, "password_hash">;
  session: Session;
}

type AuthHandlerFunction = (
  request: Request,
  context: AuthContext
) => Promise<Response>;

export function withAuthHandler(
  handler: AuthHandlerFunction
): (
  request: Request,
  context: { params: Record<string, string | string[]> }
) => Promise<Response> {
  return async (
    request: Request,
    context: { params: Record<string, string | string[]> }
  ) => {
    // Check rate limit
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await checkRateLimit({
      key: clientIp,
      maxRequests: 5,
      windowMs: 1000,
    });

    if (!isAllowed) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // Validate user authentication
    const { user, session } = await validateRequest();

    if (!user || !session) {
      return Response.json({ error: "Not authenticated" }, { status: 403 });
    }

    // If authentication passes, call the original handler with the extended context
    return handler(request, { ...context, user, session });
  };
}

type HandlerFunction = (request: Request) => Promise<Response>;

export function withRateLimitHandler(handler: HandlerFunction) {
  return async (request: Request) => {
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await checkRateLimit({
      key: clientIp,
      maxRequests: 5,
      windowMs: 1000,
    });

    if (!isAllowed) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    return handler(request);
  };
}
