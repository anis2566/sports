"use server";

import { db } from "@/lib/db";

export const GET_USER_BY_EMAIL = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const VERIFY_EMAIL = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return;
};

