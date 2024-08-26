import { AuthContext, withAuthHandler } from "@/lib/api";
import prisma from "@/lib/prisma";

async function getHandler(_request: Request, context: AuthContext) {
  const entries = await prisma.entry.findMany({
    where: {
      userId: context.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({
    message: "Entries fetched successfully",
    data: {
      entries,
    },
  });
}

export const GET = withAuthHandler(getHandler);
