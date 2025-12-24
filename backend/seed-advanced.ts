import { prisma } from "./lib/prisma";

// Helper to generate random number of referrals per user (decreases with depth)
function getReferralCount(level: number): number {
  if (level < 5) return Math.floor(Math.random() * 4) + 2; // 2-5 referrals
  if (level < 10) return Math.floor(Math.random() * 3) + 1; // 1-3 referrals
  if (level < 15) return Math.floor(Math.random() * 2) + 1; // 1-2 referrals
  if (level < 20) return Math.random() > 0.5 ? 1 : 2; // 1-2 referrals
  return Math.random() > 0.3 ? 1 : 0; // 0-1 referrals (sparse at deep levels)
}

// Helper to get random donation count (some users have 0, some have multiple)
function getDonationCount(): number {
  const rand = Math.random();
  if (rand < 0.3) return 0; // 30% have no donations
  if (rand < 0.7) return 1; // 40% have 1 donation
  if (rand < 0.9) return 2; // 20% have 2 donations
  return Math.floor(Math.random() * 3) + 3; // 10% have 3-5 donations
}

// Helper to generate random donation amount
function getRandomAmount(): number {
  return Math.floor(Math.random() * 500) + 10; // $10 - $510
}

async function seedAdvanced() {
  try {
    console.log("Starting advanced database seeding...\n");

    let totalUsers = 0;
    let totalDonations = 0;
    let userCounter = 1;

    // Create root user
    const rootUser = await prisma.user.create({
      data: { username: `user_${userCounter++}` },
    });
    totalUsers++;
    console.log(`Created root user: ${rootUser.username} (ID: ${rootUser.id})`);

    // Add donations for root user
    const rootDonationCount = getDonationCount();
    for (let i = 0; i < rootDonationCount; i++) {
      await prisma.donation.create({
        data: {
          userId: rootUser.id,
          amount: getRandomAmount(),
        },
      });
      totalDonations++;
    }

    // Track users by level
    let currentLevelUsers = [rootUser];
    let level = 1;
    const maxLevel = 27; // Create 27 levels for good measure

    while (level <= maxLevel && currentLevelUsers.length > 0) {
      const nextLevelUsers = [];

      console.log(`\nCreating level ${level}...`);

      for (const parentUser of currentLevelUsers) {
        const referralCount = getReferralCount(level);

        for (let i = 0; i < referralCount; i++) {
          const newUser = await prisma.user.create({
            data: {
              username: `user_${userCounter++}`,
              referrerId: parentUser.id,
            },
          });
          totalUsers++;
          nextLevelUsers.push(newUser);

          // Add random donations for this user
          const donationCount = getDonationCount();
          for (let j = 0; j < donationCount; j++) {
            await prisma.donation.create({
              data: {
                userId: newUser.id,
                amount: getRandomAmount(),
              },
            });
            totalDonations++;
          }
        }
      }

      console.log(
        `Level ${level} complete: ${nextLevelUsers.length} users created`
      );

      currentLevelUsers = nextLevelUsers;
      level++;
    }

    const actualMaxLevel = level - 1;

    console.log("\n" + "=".repeat(50));
    console.log("Advanced seeding complete!");
    console.log("=".repeat(50));
    console.log(`Total users created: ${totalUsers}`);
    console.log(`Total donations created: ${totalDonations}`);
    console.log(`Maximum depth level: ${actualMaxLevel}`);
    console.log(`Root user ID: ${rootUser.id}`);
    console.log(
      `\nTest the tree with: GET /summary/${rootUser.id}`
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdvanced();
