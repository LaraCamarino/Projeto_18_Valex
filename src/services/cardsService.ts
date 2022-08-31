import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";

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
        isBlocked: true,
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