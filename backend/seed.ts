import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Create top-level users (no referrer)
    const user1 = await prisma.user.create({
      data: { username: "alice" },
    });
    console.log("Created user: alice");

    const user2 = await prisma.user.create({
      data: { username: "bob" },
    });
    console.log("Created user: bob");

    // Create level 1 referrals (referred by alice)
    const user3 = await prisma.user.create({
      data: { username: "charlie", referrerId: user1.id },
    });
    console.log("Created user: charlie (referred by alice)");

    const user4 = await prisma.user.create({
      data: { username: "diana", referrerId: user1.id },
    });
    console.log("Created user: diana (referred by alice)");

    const user5 = await prisma.user.create({
      data: { username: "eve", referrerId: user2.id },
    });
    console.log("Created user: eve (referred by bob)");

    // Create level 2 referrals (referred by charlie)
    const user6 = await prisma.user.create({
      data: { username: "frank", referrerId: user3.id },
    });
    console.log("Created user: frank (referred by charlie)");

    const user7 = await prisma.user.create({
      data: { username: "grace", referrerId: user3.id },
    });
    console.log("Created user: grace (referred by charlie)");

    const user8 = await prisma.user.create({
      data: { username: "henry", referrerId: user4.id },
    });
    console.log("Created user: henry (referred by diana)");

    // Create donations
    await prisma.donation.create({
      data: { userId: user1.id, amount: 100.0 },
    });
    console.log("Created donation: $100 from alice");

    await prisma.donation.create({
      data: { userId: user1.id, amount: 50.0 },
    });
    console.log("Created donation: $50 from alice");

    await prisma.donation.create({
      data: { userId: user2.id, amount: 75.0 },
    });
    console.log("Created donation: $75 from bob");

    await prisma.donation.create({
      data: { userId: user3.id, amount: 25.0 },
    });
    console.log("Created donation: $25 from charlie");

    await prisma.donation.create({
      data: { userId: user4.id, amount: 150.0 },
    });
    console.log("Created donation: $150 from diana");

    await prisma.donation.create({
      data: { userId: user5.id, amount: 200.0 },
    });
    console.log("Created donation: $200 from eve");

    await prisma.donation.create({
      data: { userId: user6.id, amount: 30.0 },
    });
    console.log("Created donation: $30 from frank");

    await prisma.donation.create({
      data: { userId: user7.id, amount: 45.0 },
    });
    console.log("Created donation: $45 from grace");

    await prisma.donation.create({
      data: { userId: user8.id, amount: 60.0 },
    });
    console.log("Created donation: $60 from henry");

    console.log("\nDatabase seeding complete!");
    console.log("Total users: 8");
    console.log("Total donations: 9");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
