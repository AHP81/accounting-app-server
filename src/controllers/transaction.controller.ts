import { Request, Response } from "express";
import { createTransaction } from "../services/transaction.service";

export async function createTransactionController(req: Request, res: Response) {
    try {
        const result = await createTransaction(req.body);
        res.status(201).json({
            message: "Transaction successful",
            data: result,
        });
    } catch (err: any) {
        const status = err?.status ?? 400;
        res.status(status).json({
            error: err?.message || "Bad request",
            field: err?.field,
            code: err?.code,
        });
    }
}