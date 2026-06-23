import { Router } from "express";
import { createTransactionController } from "../controllers/transaction.controller";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", createTransactionController);

// history
router.get("/customer/:customerId", async (req, res) => {
    try {
        const customerId = Number(req.params.customerId);
        const currency = req.query.currency as string | undefined;

        const logs = await prisma.balanceLog.findMany({
            where: {
                customerId,
                ...(currency ? { currency: currency as any } : {}),
            },
            orderBy: { createdAt: "desc" },
        });

        res.json(logs);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;