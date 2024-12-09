"use server";

import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import {
  SignInSchema,
  SignInSchemaType,
  SignUpSchema,
  SignUpSchemaType,
} from "../schemas";
import { signIn } from "@/auth";

// REGISTER USER ACTION
export const REGISTER_USER_ACTION = async (values: SignUpSchemaType) => {
  const { data, success } = SignUpSchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return {
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return {
      success: "Registered successful",
    };
  } catch {
    throw new Error("Failed to register user");
  }
};

// // SIGN IN USER ACTION
export const SIGN_IN_USER_ACTION = async (values: SignInSchemaType) => {
  const { data, success } = SignInSchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return {
        error: "Invalid credentials",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password ?? ""
    );

    if (!isPasswordValid) {
      return {
        error: "Invalid credentials",
      };
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return {
      success: "Signed in successful",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      const { type, cause } = error as AuthError;

      switch (type) {
        case "CredentialsSignin":
          throw new Error("Invalid credentials");
        case "CallbackRouteError":
          throw new Error(cause?.err?.toString());
        default:
          throw new Error("Something went wrong");
      }
    }
  }
};
