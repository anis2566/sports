import type { JWT as DefaultJWT } from "@auth/core/jwt";
import type {
  User as DefaultUser,
  Session as DefaultSession,
} from "@auth/core/types";

import { ROLE, STATUS } from "@/constant";

declare module "@auth/core" {
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

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    role: ROLE;
    userId: string;
    status: STATUS;
  }
}
