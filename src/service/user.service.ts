"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const GET_USER = async () => {
  const session = await auth();

  if (!session?.userId) redirect("/auth/sign-in");

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) throw new Error("User not found");

  return {
    user,
    userId: user.id,
  };
};

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

// export const GET_ADMIN = async () => {
//   const admin = await db.user.findFirst({
//     where: { role: Role.Admin },
//   });

//   return {
//     adminId: admin?.id || null,
//   };
// };
