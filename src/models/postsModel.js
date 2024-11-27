import "dotenv/config";
import { ObjectId } from "mongodb";
import saveLog from "../../logger.js";
import conectarAoBanco from "../config/dbConfig.js";

export async function getAllPosts() {
  try {
    const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
  } catch (err) {
    await saveLog("Error", err.message);
  }
}

/**
* Buscar um post por Id.
* @param id Id do post que será utilizado para realizar a busca
* @param searchInternal parâmetro do tipo booleano para controlar a busca interna de post (para saber se o post existe ou não);
*/

export async function getOnePost(id, searchInternal) {

  try {
    const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id);
    const post = await colecao.findOne({_id: new ObjectId(objectId)});

    if (post && searchInternal) return {"postExists": true};

    if (!post) return {"status": 401, "mensagem": "Post não encontrado."};

    return {"status": 200, post};
  } catch (err) {
    await saveLog("Error", err.message);
  }
}

export async function createNewPost(newPost) {
  try {
    
    const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(newPost);
  } catch (err) {
    await saveLog("Error", err.message);
  }
}

export async function updatePostAsync(id, post) {
  try {
    const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id);
    return colecao.updateOne({ _id: new ObjectId(objectId) }, { $set: post });
  } catch (err) {
    await saveLog("Error", err.message);
  };
};

export async function deletedPostAsync(id) {
  const postExists = getOnePost(id, true);

  if (!postExists) return {"status": 401, "mensagem": "Post não encontrado"};

  const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
  const db = conexao.db("Imersao-instabytes");
  const colecao = db.collection("posts");
  const objectId = ObjectId.createFromHexString(id);
  colecao.deleteOne({ _id: new ObjectId(objectId)})
  
  return {"status": 200, "mensagem": "Post deletado com sucesso!"};
}
