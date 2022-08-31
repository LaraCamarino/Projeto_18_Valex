import { Request, Response } from "express";

import * as cardsService from "../services/cardsService.js";

export async function createCard (req: Request, res: Response) {
    const { employeeId, type } = req.body;
    const { "x-api-key": key } = req.headers;
    const APIKey: string = key.toString();

    await cardsService.createCard(employeeId, type, APIKey);
    
    res.status(201).send("Card created successfully");
}