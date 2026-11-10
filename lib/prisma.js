import { readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to the database.");
  }

  const url = new URL(connectionString);
  if (url.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must use the mysql: protocol.");
  }

  const sslMode = url.searchParams.get("ssl-mode")?.toUpperCase() || "";
  const caPath = process.env.DATABASE_SSL_CA;
  const supportedSslModes = [
    "",
    "DISABLED",
    "REQUIRED",
    "VERIFY_CA",
    "VERIFY_IDENTITY",
  ];

  if (!supportedSslModes.includes(sslMode)) {
    throw new Error(`Unsupported DATABASE_URL ssl-mode: ${sslMode}`);
  }

  if (["VERIFY_CA", "VERIFY_IDENTITY"].includes(sslMode) && !caPath) {
    throw new Error(
      "DATABASE_SSL_CA must point to the Aiven CA certificate when ssl-mode verifies certificates."
    );
  }

  const ssl =
    sslMode !== "DISABLED" && (sslMode || caPath)
      ? {
          ...(caPath ? { ca: readFileSync(caPath) } : {}),
          // MySQL REQUIRED encrypts traffic but does not validate the server certificate.
          ...(sslMode === "REQUIRED" && !caPath
            ? { rejectUnauthorized: false }
            : {}),
        }
      : undefined;

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    connectionLimit: 5,
    ...(ssl ? { ssl } : {}),
  });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
