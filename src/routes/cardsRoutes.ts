import { Router } from "express";
import { createCard } from "../controllers/cardsController.js";
import validateAPIKey from "../middlewares/validateAPIKey.js";

const router = Router();

router.post("/cards", validateAPIKey, createCard);
/* router.patch("/cards/:cardId/activate");
router.get("/cards/:cardId/transactions");
router.post("/cards/:cardId/block");
router.post("/cards/:cardId/unblock"); */

export default router;