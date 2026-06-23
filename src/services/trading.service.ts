import prisma from "../lib/prisma";
import { Currency } from "@prisma/client";

export async function getTradingTable() {
    const customers = await prisma.customer.findMany({
        include: {
            balances: true,
            logs: {
                take: 1,
                orderBy: { createdAt: "desc" },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return customers.map((customer) => {
        const getBalance = (currency: Currency) =>
            customer.balances.find((b) => b.currency === currency)?.balance ?? 0;

        return {
            customerId: customer.id,
            name: customer.name,

            toman: getBalance(Currency.TOMAN),
            usd: getBalance(Currency.USD),
            iqd: getBalance(Currency.IQD),

            lastActivity: customer.logs[0]?.createdAt ?? null,
            description: customer.description,
        };
    });
}