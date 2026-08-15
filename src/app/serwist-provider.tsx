"use client";

import type { ReactNode } from "react";

import { SerwistProvider } from "@serwist/turbopack/react";

type Props = {
  children: ReactNode;
};

export default function AppSerwistProvider({ children }: Props) {
  return <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>;
}
