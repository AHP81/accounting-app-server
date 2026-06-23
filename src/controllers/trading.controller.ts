import { Request, Response } from "express";
import { getTradingTable } from "../services/trading.service";

export async function getTrading(req: Request, res: Response) {
    try {
        const data = await getTradingTable();

        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}