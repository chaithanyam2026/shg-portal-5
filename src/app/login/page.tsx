import { redirect } from "next/navigation";

import { auth } from "@/auth";

import LoginContainer from "@/features/auth/ui/LoginContainer";

export const metadata = {
  title: "Login",
};

type Props = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  const { callbackUrl } = await searchParams;

  return <LoginContainer callbackUrl={callbackUrl} />;
}
