import { Request, Response } from "express";

import * as rechargesService from "../services/rechargesService.js"

export async function rechargeCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { amount } = req.body;

    await rechargesService.rechargeCard(Number(cardId), amount);

    res.status(201).send("Card recharged successfully");
}