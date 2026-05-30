import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  database: "quick_cart",
  password: "hasnain",
  user: "postgres",
});

const prisma = new PrismaClient({ adapter });

export default prisma;
