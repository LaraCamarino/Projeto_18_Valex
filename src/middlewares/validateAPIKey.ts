import { Request, Response, NextFunction } from "express";
import * as companyRepository from "../repositories/companyRepository.js";

export default async function validateAPIKey(req: Request, res: Response, next: NextFunction) {
    const { "x-api-key": key } = req.headers;
    const APIKey: string = key.toString();
    
    if (!APIKey) {
        throw {
            type: "not_found",
            message: "No API key was sent."
        };
    }

    const validKey = await companyRepository.findByApiKey(APIKey);
    if (!validKey) {
        throw {
            type: "unauthorized",
            message: "The API key sent is not valid."
        };
    }

    next();
}