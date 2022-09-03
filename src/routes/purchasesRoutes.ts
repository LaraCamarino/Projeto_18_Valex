import { Router } from "express";
import { makePurchase } from "../controllers/purchasesController.js";
import validatePurchase from "../schemas/validatePurchase.js";

const router = Router();

router.post("/purchases/:cardId", validatePurchase, makePurchase);

export default router;