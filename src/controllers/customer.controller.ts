import { Request, Response } from "express";
import * as customerService from "../services/customer.service";

function sendError(res: Response, err: any) {
    const status = err?.status ?? 500;
    res.status(status).json({
        error: err?.message || "Internal server error",
        field: err?.field,
        code: err?.code,
    });
}

export async function createCustomer(req: Request, res: Response) {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (err: any) {
        sendError(res, err);
    }
}

export async function getAllCustomers(_req: Request, res: Response) {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (err: any) {
        sendError(res, err);
    }
}

export async function getCustomerById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const customer = await customerService.getCustomerById(id);

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json(customer);
    } catch (err: any) {
        sendError(res, err);
    }
}

export async function updateCustomer(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const customer = await customerService.updateCustomer(id, req.body);
        res.json(customer);
    } catch (err: any) {
        sendError(res, err);
    }
}

export async function deleteCustomer(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await customerService.deleteCustomer(id);
        res.status(204).send();
    } catch (err: any) {
        sendError(res, err);
    }
}