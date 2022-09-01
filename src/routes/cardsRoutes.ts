import { Router } from "express";
import { createCard, activateCard, getCardTransactions } from "../controllers/cardsController.js";
import validateAPIKey from "../middlewares/validateAPIKey.js";
import validateCreateCard from "../schemas/validateCreateCard.js";
import validateActivateCard from "../schemas/validateActivateCard.js";

const router = Router();

router.post("/cards", validateAPIKey, validateCreateCard, createCard);
router.patch("/cards/:cardId/activate", validateActivateCard, activateCard);
router.get("/cards/:cardId/transactions", getCardTransactions);
/* 
router.post("/cards/:cardId/block");
router.post("/cards/:cardId/unblock"); */

export default router;