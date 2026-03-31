import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 chars")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
})



export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});