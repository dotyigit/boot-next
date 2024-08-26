import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password can't be less than 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
