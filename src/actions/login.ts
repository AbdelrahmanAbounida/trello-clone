"use server";
import { signIn } from "@/auth";
import { prismadb } from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECTED } from "@/routes";
import { loginSchema } from "@/schemas/auth-schemas";
import { AuthError } from "next-auth";

export const loginUser = async ({
  email,
  password,
  callbackurl,
}: {
  email: string;
  password: string;
  callbackurl: string | null;
}) => {
  try {
    const validFields = loginSchema.safeParse({ email, password });
    if (!validFields.success) {
      return { error: "Email or password is not valid" };
    }

    // check if email exists
    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user?.email || !user.hashedPassword)
      return { error: "Email doesn't exist" };

    console.log({ user });

    // login the user
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackurl || DEFAULT_LOGIN_REDIRECTED,
    });

    return { success: "You logged in successfully" };
  } catch (error) {
    // console.log({ error });

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };

        default:
          return { error: "Something went wrong" };
      }
    }
    // return { error: "Something went wrong" };
    throw error;
  }
};
