import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { User as DefaultUser, Session as DefaultSession } from "next-auth";

import { ROLE, STATUS } from "@/constant";

declare module "next-auth" {
  interface Session extends DefaultSession {
    role: ROLE;
    userId: string;
    user: User;
    status: STATUS;
  }

  interface User extends DefaultUser {
    role: ROLE;
    status: STATUS;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: ROLE;
    userId: string;
    status: STATUS;
  }
}
