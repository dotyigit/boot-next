"use server";
import { protectedActionClient } from "@/lib/safe-action";
import { createEntrySchema, deleteEntrySchema } from "./schema";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { returnValidationErrors } from "next-safe-action";

export const createEntry = protectedActionClient
  .metadata({
    actionName: "create-entry",
  })
  .schema(createEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { title, content } = parsedInput;
    const { user } = ctx;

    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    revalidateTag("entries");

    return {
      status: "success",
      message: "Entry created successfully",
      entry,
    };
  });

export const deleteEntry = protectedActionClient
  .metadata({
    actionName: "delete-entry",
  })
  .schema(deleteEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { user } = ctx;

    // check if the entry belongs to the user
    const entry = await prisma.entry.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!entry) {
      return returnValidationErrors(deleteEntrySchema, {
        _errors: ["Entry not found"],
      });
    }

    await prisma.entry.delete({
      where: {
        id: entry.id,
      },
    });

    revalidateTag("entries");

    return {
      status: "success",
      message: "Entry deleted successfully",
    };
  });
