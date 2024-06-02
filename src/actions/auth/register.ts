"use server";

import { getUserbyEmail } from "@/lib/user";
import { registerSchema } from "@/schemas/auth-schemas";
import * as z from "zod";
import bcrypt from "bcrypt";
import { prismadb } from "@/lib/db";

export const registerUser = async ({
  email,
  password,
  confirmPassword,
}: z.infer<typeof registerSchema>) => {
  if (password !== confirmPassword) {
    return { error: "Passwords don't match" };
  }
  try {
    // check if user exists
    const userExists = await getUserbyEmail({ email });

    if (userExists) {
      return { error: "User Already exists" };
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);

    await prismadb.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
    return { success: "Your account has been created successfully" };
  } catch (error) {
    console.log({ error });
    return { error: "Failed to register user for this account" };
  }
};
