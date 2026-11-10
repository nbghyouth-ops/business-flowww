import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL wajib diisi untuk menjalankan perintah Drizzle.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
