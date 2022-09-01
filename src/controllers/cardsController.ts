import { Request, Response } from "express";

import * as cardsService from "../services/cardsService.js";

export async function createCard (req: Request, res: Response) {
    const { employeeId, type } = req.body;
    const { "x-api-key": key } = req.headers;
    const APIKey: string = key.toString();

    await cardsService.createCard(employeeId, type, APIKey);
    
    res.status(201).send("Card created successfully");
}

export async function activateCard (req: Request, res: Response) {
    const { cardId } = req.params;
    const { cvc, password } = req.body;

    await cardsService.activateCard(Number(cardId), cvc, password);
    
    res.status(200).send("Card activated successfully");
}

export async function getCardTransactions (req: Request, res: Response) {
    const { cardId } = req.params;

    const cardTransactions = await cardsService.getCardTransactions(Number(cardId));

    res.status(200).send(cardTransactions);
}