// routes/transaction.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// ایجاد تراکنش جدید و به‌روزرسانی خودکار موجودی
router.post('/', async (req, res) => {
    try {
        const { customerId, currency, amount, note } = req.body;

        // amount باید یک عدد صحیح باشد (مثلاً 1000 تومان، 500 دلار، 250 دینار)
        // currency یکی از 'TOMAN', 'USD', 'IQD'

        const result = await prisma.$transaction(async (tx) => {
            // ۱. ثبت لاگ تراکنش
            const log = await tx.balanceLog.create({
                data: {
                    customerId,
                    currency,
                    amount,
                    note,
                },
            });

            // ۲. یافتن یا ایجاد CustomerBalance برای این ارز
            const balanceRecord = await tx.customerBalance.upsert({
                where: {
                    customerId_currency: { customerId, currency },
                },
                update: {
                    balance: { increment: amount }, // افزایش یا کاهش (اگر amount منفی باشد کاهش می‌دهد)
                },
                create: {
                    customerId,
                    currency,
                    balance: amount,
                },
            });

            return { log, balance: balanceRecord };
        });

        res.status(201).json({
            message: 'Transaction successful',
            transaction: result.log,
            newBalance: result.balance,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// دریافت تاریخچه تراکنش‌های یک مشتری (فیلتر با ارز اختیاری)
router.get('/customer/:customerId', async (req, res) => {
    try {
        const { currency } = req.query;
        const where = { customerId: parseInt(req.params.customerId) };
        if (currency) {
            where.currency = currency;
        }
        const logs = await prisma.balanceLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;