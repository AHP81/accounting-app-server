import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.customer.createMany({
        data: [
            {
                "name": "Ali Ahmadi",
                "phoneNumber": "09123456789",
                "cardNumber": "3242424242424242",
                "description": "Tozihat sample 1"
            },
            {
                "name": "Sara Mohammadi",
                "phoneNumber": "09124567890",
                "cardNumber": "4000056655465556",
                "description": "Tozihat sample 2"
            },
            {
                "name": "Reza Karimi",
                "phoneNumber": "09135678901",
                "cardNumber": "5555555556554444",
                "description": "Tozihat sample 3"
            },
            {
                "name": "Nima Hosseini",
                "phoneNumber": "09146789012",
                "cardNumber": "4012878888881881",
                "description": "Tozihat sample 4"
            },
            {
                "name": "Mina Ebrahimi",
                "phoneNumber": "09157890123",
                "cardNumber": "4242424282424242",
                "description": "Tozihat sample 5"
            },
            {
                "name": "Mohsen Gholami",
                "phoneNumber": "09168901234",
                "cardNumber": "4900056655665556",
                "description": "Tozihat sample 6"
            },
            {
                "name": "Zahra Najafi",
                "phoneNumber": "09179012345",
                "cardNumber": "5555550555554444",
                "description": "Tozihat sample 7"
            },
            {
                "name": "Amir Rahimi",
                "phoneNumber": "09180123456",
                "cardNumber": "4012888818881881",
                "description": "Tozihat sample 8"
            },
            {
                "name": "Elham Safari",
                "phoneNumber": "09191234567",
                "cardNumber": "4242434242424242",
                "description": "Tozihat sample 9"
            },
            {
                "name": "Kaveh Moradi",
                "phoneNumber": "09192345678",
                "cardNumber": "4000056655665552",
                "description": "Tozihat sample 10"
            },
            {
                "name": "Parsa Tavakoli",
                "phoneNumber": "09193456789",
                "cardNumber": "5554555555554444",
                "description": "Tozihat sample 11"
            },
            {
                "name": "Neda Kazemi",
                "phoneNumber": "09194567890",
                "cardNumber": "4012888588881881",
                "description": "Tozihat sample 12"
            },
            {
                "name": "Arman Sadeghi",
                "phoneNumber": "09195678901",
                "cardNumber": "4242424242624242",
                "description": "Tozihat sample 13"
            },
            {
                "name": "Shayan Hashemi",
                "phoneNumber": "09196789012",
                "cardNumber": "4000056655665576",
                "description": "Tozihat sample 14"
            },
            {
                "name": "Fatemeh Rahmani",
                "phoneNumber": "09197890123",
                "cardNumber": "8555555555554444",
                "description": "Tozihat sample 15"
            },
            {
                "name": "Omid Jalali",
                "phoneNumber": "09198901234",
                "cardNumber": "4012888898881881",
                "description": "Tozihat sample 16"
            },
            {
                "name": "Maryam Salehi",
                "phoneNumber": "09199012345",
                "cardNumber": "4242404202424242",
                "description": "Tozihat sample 17"
            },
            {
                "name": "Hamed Yeganeh",
                "phoneNumber": "09190123456",
                "cardNumber": "4000051555665556",
                "description": "Tozihat sample 18"
            },
            {
                "name": "Leila Vaziri",
                "phoneNumber": "09191234098",
                "cardNumber": "5555587255554444",
                "description": "Tozihat sample 19"
            },
            {
                "name": "Pouya Darvishi",
                "phoneNumber": "09192345087",
                "cardNumber": "4012898788881881",
                "description": "Tozihat sample 20"
            }
        ],
    });

    console.log("🌱 Seeding finished");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });