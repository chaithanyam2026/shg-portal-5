import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

console.log(process.env.APP_NAME);
console.log(process.env.MONGODB_URI);
console.log(process.env.NODE_ENV);
