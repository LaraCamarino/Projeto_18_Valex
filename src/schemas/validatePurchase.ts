import joi from "joi";
import { Request, Response, NextFunction } from "express";

export default async function validatePurchase(req: Request, res: Response, next: NextFunction) {

    const purchaseSchema = joi.object({
        password: joi.string().required(),
        businessId: joi.number().required(),
        amount: joi.number().min(1).required()
    });
    const validation = purchaseSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        throw {
            type: "unprocessable_entity",
            message: `${validation.error.details[0].message}`
        };
    }

    next();
}