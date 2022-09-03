import { Router } from "express";
import { rechargeCard } from "../controllers/rechargesController.js";
import validateAPIKey from "../middlewares/validateAPIKey.js";
import validateRecharge from "../schemas/validateRecharge.js";

const router = Router();

router.post("/recharges/:cardId", validateAPIKey, validateRecharge, rechargeCard);

export default router;