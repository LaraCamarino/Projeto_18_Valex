import { Router } from "express";
import { rechargeCard } from "../controllers/rechargesController.js";
import validateAPIKey from "../middlewares/validateAPIKey.js";

const router = Router();

router.post("/recharges/:cardId", validateAPIKey, rechargeCard);

export default router;