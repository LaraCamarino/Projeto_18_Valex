import joi from "joi";
import { Request, Response, NextFunction } from "express";

export default async function validateRecharge(req: Request, res: Response, next: NextFunction) {

    const rechargeSchema = joi.object({
        amount: joi.number().min(1).required()
    });
    const validation = rechargeSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        throw {
            type: "unprocessable_entity",
            message: `${validation.error.details[0].message}`
        };
    }

    next();
}