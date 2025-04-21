import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";

export const hashAndSaltPw = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

/**
 * Description
 * @param {string} password - The user submitted password
 * @param {string} hashedPassword - The db password hash
 * @returns {boolean} If the hashed user password matches the hash in the db
 *
 * @example
 * const password = "mypassword"
 * const dbPassword = await db.get(password, user)
 * verifyPassword(password, dbPassword) // true/false
 */
export const verifyPassword = (password: string, hashedPassword: string) => {
  return compareSync(password, hashedPassword);
};
