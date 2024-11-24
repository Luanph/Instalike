import { createRequire } from "module";
import saveLog from "../../logger";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

export default async function validadeLogin(user, password) {
  if (user === process.env.LOGIN && password === process.env.password) {
    try {
      const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "300s" });
      return {
        status: 200,
        userIsAuth: 1,
        token,
      };
    } catch (err) {
      await saveLog("Error", err.message)
      return {
        status: 500
      };
    };
  } else {
    return {
      status: 403,
      userIsAuth: 0,
    };
  };
};
