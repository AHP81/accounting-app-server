import prisma from "../lib/prisma";
import { Currency } from "@prisma/client";

type CreateTransactionInput = {
    customerId: number;
    currency: Currency;
    amount: number;
    note?: string;
};

function createHttpError(
    status: number,
    message: string,
    field?: string,
    code?: string
) {
    const err = new Error(message) as Error & {
        status: number;
        field?: string;
        code?: string;
    };
    err.status = status;
    err.field = field;
    err.code = code;
    return err;
}

export async function createTransaction(data: CreateTransactionInput) {
    if (!Number.isInteger(data.customerId) || data.customerId <= 0) {
        throw createHttpError(422, "customerId معتبر نیست", "customerId");
    }

    if (!Object.values(Currency).includes(data.currency)) {
        throw createHttpError(422, "currency معتبر نیست", "currency");
    }

    if (!Number.isFinite(data.amount) || data.amount === 0) {
        throw createHttpError(422, "amount معتبر نیست", "amount");
    }

    const customer = await prisma.customer.findUnique({
        where: { id: data.customerId },
        select: { id: true },
    });

    if (!customer) {
        throw createHttpError(404, "Customer not found", "customerId");
    }

    return prisma.$transaction(async (tx) => {
        const balance = await tx.customerBalance.upsert({
            where: {
                customerId_currency: {
                    customerId: data.customerId,
                    currency: data.currency,
                },
            },
            update: {
                balance: { increment: data.amount },
            },
            create: {
                customerId: data.customerId,
                currency: data.currency,
                balance: data.amount,
            },
        });

        const log = await tx.balanceLog.create({
            data: {
                customerId: data.customerId,
                balanceId: balance.id,
                currency: data.currency,
                amount: data.amount,
                note: data.note?.trim() || undefined,
            },
        });

        return { balance, log };
    });
}