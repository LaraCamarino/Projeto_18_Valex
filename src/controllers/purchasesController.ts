import { Request, Response } from "express";

import * as purchasesService from "../services/purchasesService.js";

export async function makePurchase(req: Request, res: Response) {
    const { cardId } = req.params;
    const { password, businessId, amount } = req.body;

    await purchasesService.makePurchase(Number(cardId), password, businessId, amount);

    res.status(200).send("Purchase registered successfully.");
}