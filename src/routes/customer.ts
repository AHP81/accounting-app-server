// routes/customer.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// ایجاد مشتری جدید
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, cardNumber, description } = req.body;
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// دریافت همه مشتری‌ها (با موجودی‌ها)
router.get('/', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                balances: true,
            },
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// دریافت یک مشتری با موجودی‌ها و آخرین تراکنش‌ها
router.get('/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                balances: true,
                logs: {
                    take: 10, // ۱۰ تراکنش آخر
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// به‌روزرسانی مشتری
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, cardNumber, description } = req.body;
        const customer = await prisma.customer.update({
            where: { id: parseInt(req.params.id) },
            data: { firstName, lastName, phoneNumber, cardNumber, description },
        });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// حذف مشتری (با رعایت احتیاط)
router.delete('/:id', async (req, res) => {
    try {
        await prisma.customer.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;