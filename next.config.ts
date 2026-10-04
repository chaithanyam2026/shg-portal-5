import type { NextConfig } from "next";

import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  serverExternalPackages: ["esbuild", "sharp"],
};

export default withSerwist(nextConfig);
