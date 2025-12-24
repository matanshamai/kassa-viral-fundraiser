import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create donation
router.post('/', async (req, res) => {
  const { userId, amount } = req.body;

  const donation = await prisma.donation.create({
    data: {
      userId: parseInt(userId),
      amount: parseFloat(amount),
    },
  });

  res.json({
    userId,
    amount: donation.amount,
  });
});

export default router;
