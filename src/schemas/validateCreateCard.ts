import joi from "joi";
import { Request, Response, NextFunction } from "express";

export default async function validateCreateCard(req: Request, res: Response, next: NextFunction) {

    const createCardSchema = joi.object({
        employeeId: joi.number().required(),
        type: joi.string().valid("groceries", "restaurants", "transport", "education", "health").required()
    });
    const validation = createCardSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        console.log(validation.error.details)
        throw {
            type: "unprocessable_entity",
            message: `${validation.error.details[0].message}`
        };
    }

    next();
}

