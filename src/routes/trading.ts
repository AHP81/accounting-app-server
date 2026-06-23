import { Router } from "express";
import { getTrading } from "../controllers/trading.controller";

const router = Router();

router.get("/", getTrading);

export default router;