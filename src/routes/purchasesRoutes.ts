import { Router } from "express";
import { makePurchase } from "../controllers/purchasesController.js";

const router = Router();

router.post("/purchases/:cardId", makePurchase);

export default router;