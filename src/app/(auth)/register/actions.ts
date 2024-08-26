"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { registerSchema } from "./schema";
import { unprotectedActionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

interface ActionResult {
  error?: string;
}

export const registerAction = unprotectedActionClient
  .metadata({
    actionName: "register",
  })
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const userExists = await prisma.user.findUnique({
      where: {
        email: parsedInput.email,
      },
    });

    if (userExists) {
      return returnValidationErrors(registerSchema, {
        _errors: ["User with this email already exists"],
      });
    }

    const passwordHash = await hash(parsedInput.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const createdUser = await prisma.user.create({
      data: {
        email: parsedInput.email,
        password_hash: passwordHash,
      },
    });

    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/entries");
  });
