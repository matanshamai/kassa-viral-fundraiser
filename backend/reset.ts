import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("Resetting database...");

    // Delete in order to respect foreign key constraints
    await prisma.donation.deleteMany({});
    console.log("Deleted all donations");

    await prisma.user.deleteMany({});
    console.log("Deleted all users");

    console.log("Database reset complete!");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
