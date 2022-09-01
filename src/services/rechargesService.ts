import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardsRepository from "../repositories/cardsRepository.js";

export async function rechargeCard(cardId: number, amount: number) {

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

    await rechargeRepository.insert({ cardId, amount });
}