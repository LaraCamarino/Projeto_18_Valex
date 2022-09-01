import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import * as cardsRepository from "../repositories/cardsRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

const cryptr = new Cryptr('secretKey');

export async function createCard(employeeId: number, type: cardsRepository.TransactionTypes, APIKey: string) {

    const company = await companyRepository.findByApiKey(APIKey);
    if (!company) {
        throw {
            type: "not_found",
            message: "The API key does not belong to any company."
        };
    }

    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
        throw {
            type: "not_found",
            message: "No employee found with that ID."
        };
    }

    const verifyExistingCard = await cardsRepository.findByTypeAndEmployeeId(type, employeeId);
    if (verifyExistingCard) {
        throw {
            type: "conflict",
            message: "This employee already has a card with that type."
        };
    }

    const cardData = {
        employeeId,
        number: generateCardNumber(),
        cardholderName: generateCardholderName(employee.fullName),
        securityCode: generateCardSecurityCode(),
        expirationDate: generateExpirationDate(),
        isVirtual: false,
        isBlocked: false,
        type
    };

    await cardsRepository.insert(cardData);
    console.log(cardData);
}

function generateCardNumber() {
    return faker.finance.creditCardNumber("visa");
}

function generateCardSecurityCode() {
    const securityCode = faker.finance.creditCardCVV();
    const encryptedSecurityCode = cryptr.encrypt(securityCode);

    return encryptedSecurityCode;
}

function generateCardholderName(fullName: string) {
    const splitName: string[] = fullName.split(" ");
    let firstName: string = splitName.shift();
    let lastName: string = splitName.pop();
    let middleNames = splitName.filter((name) => name.length >= 3);

    let middleNamesInitials = middleNames.map((name) => name[0]);

    if (middleNames.length > 0) {
        return [firstName, middleNamesInitials.join(" "), lastName].join(" ").toUpperCase();
    }

    return [firstName, lastName].join(" ").toUpperCase();
}

function generateExpirationDate() {
    return dayjs().add(5, "year").format("MM-YY");
}

export async function activateCard(cardId: number, cvc: string, password: string) {
    const today = dayjs().format("MM-YY");

    if (password.length > 0 && password.length < 4) {
        throw {
            type: "bad_request",
            message: "Invalid password."
        };
    }

    const card = await cardsRepository.findById(cardId);
    if (!card) {
        throw {
            type: "not_found",
            message: "The card was not found."
        };
    }

    /* if (dayjs(today).isAfter(dayjs(card.expirationDate))) {
        throw {
            type: "bad_request",
            message: "This card is already expired."
        };
    } */

    if (card.password) {
        throw {
            type: "bad_request",
            message: "This card was already activated."
        };
    }

    verifyValidCVC(cvc, card.securityCode);

    const encryptedPassword = bcrypt.hashSync(password, 10);

    await cardsRepository.update(cardId, { password: encryptedPassword })
}

function verifyValidCVC(cvc: string, securityCode: string) {
    const decryptedSecurityCode = cryptr.decrypt(securityCode);
    if(cvc !== decryptedSecurityCode) {
        throw {
            type: "unauthorized",
            message: "Invalid CVC."
        };
    }
}

