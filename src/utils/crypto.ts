import * as crypto from "crypto";

export const generateTokenRandom = (size: number) => {
    return crypto.randomBytes(size).toString('hex');
};