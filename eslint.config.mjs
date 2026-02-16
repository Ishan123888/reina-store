import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  basePath: __dirname,
});

const eslintConfig = [
  // Next.js Core Web Vitals නීති ඇතුළත් කිරීම
  ...compat.extends("next/core-web-vitals"),
  // TypeScript සඳහා අවශ්‍ය නීති ඇතුළත් කිරීම
  ...compat.extends("next/typescript"),
  {
    // Ignore කළ යුතු Folder සහ Files මෙහි සඳහන් කරන්න
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**"
    ],
  }
];

export default eslintConfig;