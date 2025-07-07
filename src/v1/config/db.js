import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
   try {
      await prisma.$connect();
      console.log("Database connected!");
   } catch (error) {
      console.error("Database connection failed:", error.message);
      process.exit(1);
   }
};
