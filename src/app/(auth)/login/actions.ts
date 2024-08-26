"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "./schema";
import { unprotectedActionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const loginAction = unprotectedActionClient
  .metadata({
    actionName: "login",
  })
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedInput.email,
      },
      select: {
        id: true,
        email: true,
        email_verified: true,
        password_hash: true,
      },
    });

    if (!existingUser) {
      return returnValidationErrors(loginSchema, {
        _errors: ["User with this email doesn't exist"],
      });
    }

    const validPassword = await verify(
      existingUser.password_hash,
      parsedInput.password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!validPassword) {
      return returnValidationErrors(loginSchema, {
        _errors: ["Incorrect username or password"],
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/entries");
  });
