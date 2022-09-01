import joi from "joi";
import { Request, Response, NextFunction } from "express";

export default async function validateActivateCard(req: Request, res: Response, next: NextFunction) {

    const activateCardSchema = joi.object({
        cvc: joi.string().required(),
        password: joi.string().required()
    });
    const validation = activateCardSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        console.log(validation.error.details)
        throw {
            type: "unprocessable_entity",
            message: `${validation.error.details[0].message}`
        };
    }

    next();
}