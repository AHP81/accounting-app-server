import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// ایجاد مشتری جدید
router.post("/", async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phoneNumber, cardNumber, description } =
            req.body;

        const customer = await prisma.customer.create({
            data: {
                firstName,
                lastName,
                phoneNumber,
                cardNumber,
                description,
            },
        });

        res.status(201).json(customer);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// دریافت همه مشتری‌ها
router.get("/", async (_req: Request, res: Response) => {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                balances: true,
            },
        });

        res.json(customers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// دریافت یک مشتری
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                balances: true,
                logs: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json(customer);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// آپدیت مشتری
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { firstName, lastName, phoneNumber, cardNumber, description } =
            req.body;

        const customer = await prisma.customer.update({
            where: { id },
            data: { firstName, lastName, phoneNumber, cardNumber, description },
        });

        res.json(customer);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// حذف مشتری
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await prisma.customer.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;