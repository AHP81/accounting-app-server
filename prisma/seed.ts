import { PrismaClient, Currency } from "@prisma/client";

const prisma = new PrismaClient();

// 🎲 random helper
const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const currencies = [Currency.TOMAN, Currency.USD, Currency.IQD];

const names = [
    "Ali Ahmadi",
    "Sara Mohammadi",
    "Reza Karimi",
    "Nima Hosseini",
    "Mina Ebrahimi",
    "Mohsen Gholami",
    "Zahra Najafi",
    "Amir Rahimi",
    "Elham Safari",
    "Kaveh Moradi",
    "Parsa Tavakoli",
    "Neda Kazemi",
    "Arman Sadeghi",
    "Shayan Hashemi",
    "Fatemeh Rahmani",
    "Omid Jalali",
    "Maryam Salehi",
    "Hamed Yeganeh",
    "Leila Vaziri",
    "Pouya Darvishi",
];

async function main() {
    console.log("🌱 Seed started...");

    // 🧹 clean DB
    await prisma.balanceLog.deleteMany();
    await prisma.customerBalance.deleteMany();
    await prisma.customer.deleteMany();

    // 👤 create 20 customers
    await prisma.customer.createMany({
        data: names.map((name, i) => ({
            name,
            phoneNumber: `09120000${String(i + 1).padStart(2, "0")}`,
            cardNumber: String(4000000000000000n + BigInt(i + 1)),
            description: "Seeded customer",
        })),
    });

    const customers = await prisma.customer.findMany();

    // 💰 balances + logs
    for (const customer of customers) {
        const balances = [];

        for (const currency of currencies) {
            const balance = await prisma.customerBalance.create({
                data: {
                    customerId: customer.id,

                    // 🔥 اینجا balance می‌تونه منفی / صفر / مثبت باشه
                    balance: rand(-500000, 1000000),

                    currency,
                },
            });

            balances.push(balance);
        }

        // 🧾 logs (زیادتر و واقعی‌تر)
        for (const balance of balances) {
            const logCount = rand(3, 8); // 👈 بیشتر از قبل

            for (let i = 0; i < logCount; i++) {
                const isDeposit = Math.random() > 0.4;

                await prisma.balanceLog.create({
                    data: {
                        customerId: customer.id,
                        balanceId: balance.id,
                        currency: balance.currency,

                        amount: isDeposit
                            ? rand(10000, 200000)
                            : -rand(5000, 150000),

                        note: isDeposit ? "Deposit" : "Withdrawal",
                    },
                });
            }
        }
    }

    console.log("✅ Seed finished successfully");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });