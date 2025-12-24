import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Login - create or find user
router.post("/login", async (req, res) => {
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
});

export default router;
