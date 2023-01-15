import { genSalt, hash, compare } from "bcrypt";

export const encryptedPassword = async (password: string) => {
  if (password !== undefined) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  throw new Error("password undefined");
};
/**
 *
 * @param password contraseña recivida
 * @param recivedPassword contraseña encriptada en bd
 * @returns Booleand
 */

export const comparePassword = async (
  password: string,
  recivedPassword: string
) => {
  return await compare(password, recivedPassword);
};
