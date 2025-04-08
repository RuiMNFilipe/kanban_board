import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";

export const hashAndSaltPw = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const verifyPassword = (password: string, hashedPassword: string) => {
  return compareSync(password, hashedPassword);
};
