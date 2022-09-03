import bcrypt from "bcrypt";

import * as cardsRepository from "../repositories/cardsRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardsService from "../services/cardsService.js";

export async function makePurchase(cardId: number, password: string, businessId: number, amount: number) {

    const card = await cardsRepository.findById(cardId);
    if (!card) {
        throw {
            type: "not_found",
            message: "The card was not found."
        };
    }

    if(!card.password) {
        throw {
            type: "not_found",
            message: "This card is not active."
        };
    }

    if(card.isBlocked) {
        throw {
            type: "unauthorized",
            message: "This card is blocked."
        };
    }

    cardsService.verifyCardExpired(card.expirationDate);

    const verifyPassword = bcrypt.compareSync(password, card.password);
    if (!verifyPassword) {
        throw {
            type: "unauthorized",
            message: "Wrong password."
        };
    }

    const business = await businessRepository.findById(businessId);
    if(!business) {
        throw {
            type: "not_found",
            message: "Business not found."
        };
    }

    if(business.type !== card.type) {
        throw {
            type: "bad_request",
            message: "The card is not valid for this business type."
        };
    }

    const payments = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    const balance = verifySufficientFunds(payments, recharges);

    if(balance < amount) {
        throw {
            type: "bad_request",
            message: "Purchase denied for lack of funds."
        };
    }

    await paymentRepository.insert({ cardId, businessId, amount });
}

function verifySufficientFunds(payments, recharges) {
    let totalPayments = 0;
    let totalRecharges = 0;

    payments.map((item) => totalPayments += item.amount);
    recharges.map((item) => totalRecharges += item.amount);

    return totalRecharges - totalPayments;
}