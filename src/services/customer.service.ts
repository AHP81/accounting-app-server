import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

type CreateCustomerInput = {
    name: string;
    phoneNumber?: string;
    cardNumber?: string;
    description?: string;
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

function normalize(value?: string | null) {
    const v = value?.trim();
    return v ? v : undefined;
}

const PHONE_REGEX = /^09\d{9}$/;
const CARD_REGEX = /^\d{16}$/;

export async function createCustomer(data: CreateCustomerInput) {
    const name = normalize(data.name);
    const phoneNumber = normalize(data.phoneNumber);
    const cardNumber = normalize(data.cardNumber);
    const description = normalize(data.description);

    if (!name) {
        throw createHttpError(422, "نام و نام خانوادگی الزامی است", "name");
    }

    if (phoneNumber && !PHONE_REGEX.test(phoneNumber)) {
        throw createHttpError(
            422,
            "شماره موبایل باید با 09 شروع شود و 11 رقم باشد",
            "phoneNumber"
        );
    }

    if (cardNumber && !CARD_REGEX.test(cardNumber)) {
        throw createHttpError(422, "شماره کارت باید 16 رقم باشد", "cardNumber");
    }

    const duplicate = await prisma.customer.findFirst({
        where: {
            OR: [
                ...(phoneNumber ? [{ phoneNumber }] : []),
                ...(cardNumber ? [{ cardNumber }] : []),
            ],
        },
        select: {
            id: true,
            phoneNumber: true,
            cardNumber: true,
        },
    });

    if (duplicate) {
        if (phoneNumber && duplicate.phoneNumber === phoneNumber) {
            throw createHttpError(409, "شماره موبایل تکراری است", "phoneNumber");
        }

        if (cardNumber && duplicate.cardNumber === cardNumber) {
            throw createHttpError(409, "شماره کارت تکراری است", "cardNumber");
        }
    }

    try {
        return await prisma.customer.create({
            data: {
                name,
                phoneNumber,
                cardNumber,
                description,
            },
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            throw createHttpError(409, "اطلاعات وارد شده تکراری است");
        }
        throw err;
    }
}

export function getAllCustomers() {
    return prisma.customer.findMany({
        include: {
            balances: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export function getCustomerById(id: number) {
    return prisma.customer.findUnique({
        where: { id },
        include: {
            balances: true,
            logs: {
                take: 20,
                orderBy: { createdAt: "desc" },
            },
        },
    });
}

export function updateCustomer(
    id: number,
    data: {
        name?: string;
        phoneNumber?: string;
        cardNumber?: string;
        description?: string;
    }
) {
    return prisma.customer.update({
        where: { id },
        data,
    });
}

export function deleteCustomer(id: number) {
    return prisma.customer.delete({
        where: { id },
    });
}