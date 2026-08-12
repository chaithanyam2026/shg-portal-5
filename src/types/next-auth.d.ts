import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      role: string;
      memberId: string | null;
    };
  }

  interface User {
    id: string;
    username: string;
    role: string;
    memberId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
    memberId?: string | null;
  }
}
