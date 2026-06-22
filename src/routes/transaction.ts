import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { customerId, currency, amount, note } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            const log = await tx.balanceLog.create({
                data: {
                    customerId,
                    currency,
                    amount,
                    note,
                },
            });

            const balance = await tx.customerBalance.upsert({
                where: {
                    customerId_currency: { customerId, currency },
                },
                update: {
                    balance: { increment: amount },
                },
                create: {
                    customerId,
                    currency,
                    balance: amount,
                },
            });

            return { log, balance };
        });

        res.status(201).json({
            message: "Transaction successful",
            transaction: result.log,
            newBalance: result.balance,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// تاریخچه تراکنش‌ها
router.get(
    "/customer/:customerId",
    async (req: Request, res: Response) => {
        try {
            const customerId = Number(req.params.customerId);
            const { currency } = req.query;

            const where: any = { customerId };

            if (currency) {
                where.currency = currency;
            }

            const logs = await prisma.balanceLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
            });

            res.json(logs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

export default router;