import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Login - create or find user
router.post("/login", async (req, res, next) => {
  try {
    const { username, referrerId } = req.body;

    let user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          referrerId: referrerId ? parseInt(referrerId) : null,
        },
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
