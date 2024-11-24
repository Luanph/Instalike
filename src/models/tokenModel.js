import { createRequire } from "module";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

export default async function validadeToken(token) {
    return new Promise((resolve) => {
      jwt.verify(token, SECRET_KEY, (err) => {
        if (err) return resolve({"tokenIsValid": false, "mensagem":"Token inválido ou expirado"}); 
        resolve({"tokenIsValid": true});
      });
    });
  };