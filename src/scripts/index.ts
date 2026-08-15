import { loadEnvConfig } from "@next/env";

async function main() {
  loadEnvConfig(process.cwd());

  const script = process.argv[2];

  switch (script) {
    case "members":
      await import("./seed-members");
      break;

    case "financial-year":
      // await import('./seed-financial-year');
      break;

    case "admin":
      await import("./seed-admin");
      break;

    default:
      throw new Error(`Unknown script: ${script}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
