import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Get summary - user's donations + descendant tree with totals per level
router.get("/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    // Get user's own donations total using SQL aggregation
    const userTotalResult = await prisma.$queryRaw<[{ total: number | null }]>`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM Donation
      WHERE userId = ${userId}
    `;
    const userTotal = Number(userTotalResult[0]?.total || 0);

    // Use recursive CTE to get all descendants with their levels and donation totals
    const levelsRaw = await prisma.$queryRaw<
      { level: bigint; userCount: bigint; total: number }[]
    >`
      WITH RECURSIVE descendant_tree AS (
        -- Base case: direct referrals of the user
        SELECT
          u.id,
          1 as level
        FROM User u
        WHERE u.referrerId = ${userId}

        UNION ALL

        -- Recursive case: referrals of referrals
        SELECT
          u.id,
          dt.level + 1
        FROM User u
        INNER JOIN descendant_tree dt ON u.referrerId = dt.id
      )
      SELECT
        dt.level,
        COUNT(DISTINCT dt.id) as userCount,
        COALESCE(SUM(d.amount), 0) as total
      FROM descendant_tree dt
      LEFT JOIN Donation d ON d.userId = dt.id
      GROUP BY dt.level
      ORDER BY dt.level
    `;

    // Convert BigInt to Number for JSON serialization
    const levels = levelsRaw.map((row) => ({
      level: Number(row.level),
      userCount: Number(row.userCount),
      total: row.total,
    }));

    res.json({
      userId,
      userTotal,
      levels,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
