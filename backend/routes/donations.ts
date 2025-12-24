import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Create donation
router.post('/', async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

export default router;
