import { validateRequest } from "@/lib/auth";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { checkRateLimit } from "./rate-limit";
import { headers } from "next/headers";

class ActionError extends Error {}

const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const result = await next();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);

  return result;
});

export const unprotectedActionClient = actionClient.use(async ({ next }) => {
  const clientIp =
    headers().get("x-forwarded-for") || headers().get("remote-addr");
  console.log("Client IP ->", clientIp);
  const isAllowed = await checkRateLimit({
    key: clientIp as string,
    maxRequests: 5,
    windowMs: 1000,
  });

  if (!isAllowed) {
    throw new ActionError("Rate limit exceeded. Please try again later.");
  }

  return next();
});

export const protectedActionClient = actionClient.use(async ({ next }) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new ActionError("User not found!");
  }
  return next({ ctx: { user } });
});
