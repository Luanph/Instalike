import "dotenv/config";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
const jwt = require("jsonwebtoken");
//const bodyParser = require("body-parser");
const SECRET_KEY = process.env.SECRET_KEY;

export async function validadeLogin(user, password) {
  try {
    if (user === process.env.LOGIN && password === process.env.password) {
      const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "300s" });
      return {
        status: 200,
        userIsAuth: 1,
        token,
      };
    } else {
      return {
        status: 403,
        userIsAuth: 0,
      };
    }
  } catch {
    return {
      status: 401,
      mensagem:
        "Não foi possível realizar a autenticação. Usuário ou senha incorreto",
    };
  }
}

export async function getAllPosts() {
  const db = conexao.db("Imersao-instabytes");
  const colecao = db.collection("posts");
  return colecao.find().toArray();
}

export async function createNewPost(newPost) {
  const db = conexao.db("Imersao-instabytes");
  const colecao = db.collection("posts");
  return colecao.insertOne(newPost);
}

export async function updatePost(id, post) {
  const db = conexao.db("Imersao-instabytes");
  const colecao = db.collection("posts");
  const objectId = ObjectId.createFromHexString(id);
  return colecao.updateOne({ _id: new ObjectId(objectId) }, { $set: post });
}

export async function validadeToken(token) {
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return {"tokenIsValid": false, "mensagem":"Token inválido ou expirado"};
    console.log(`user: ${user}`)
    return {"tokenIsValid": true, "user": user};
  });
};