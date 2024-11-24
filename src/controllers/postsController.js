import fs from 'fs';
import {getAllPosts, createNewPost, updatePost, validadeLogin, validadeToken} from "../models/postsModel.js";
import GenerateDescriptionWithGemini from '../services/serviceGemini.js'

export async function validadeLoginUser(req, res) {
    const user = req.body.user;
    const password = req.body.password;
    let status, userIsAuth, token;
    try {
        ({ status, userIsAuth, token } = await validadeLogin(user, password));
    } catch (err) {
        console.error(err.message);
        res.status(401).json({"mensagem": "Ocorreu um erro na autenticação"});
    }

    if (userIsAuth) {
        res.status(status).json( {token, "expireIn": "5min"} )
    } else {
        res.status(status).json({ "mensagem": "Usuário ou senha incorretos." })
    }
};

export async function listAllPosts(req, res) {
    const posts = await getAllPosts();
    res.status(200).json(posts);
};

export async function postNewPost(req, res) {
    const newPost = req.body;
    try {
        const postCriado = await createNewPost(newPost);
        res.status(201).json(postCriado);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({"Erro": "Falha ao processar requisição. "});
    };
};

export async function uploadImage(req, res) {
    const newPost = {
        descricao: "",
        urlImagem: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await createNewPost(newPost);
        const urlImagem = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, urlImagem);
        res.status(201).json(postCriado);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({"Erro": "Falha ao processar requisição. "});
    };
};

export async function updateNewPost(req, res) {
    const id = req.params.id;
    const urlImage = `http://localhost:3000/${id}.png`;
    
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const description = await GenerateDescriptionWithGemini(imageBuffer);
        const post = {
            urlImagem: urlImage,
            descricao: description,
            alt: req.body.alt
        }
        const postAtualizado = await updatePost(id, post);
        res.status(200).json(postAtualizado);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({"Erro": "Falha ao processar requisição. "});
    };
};

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"mensagem": "Header não fornecido"});
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ "mensagem": "Token não fornecido" });
    
    let tokenIsValid, mensagem;

    try {
        ({ tokenIsValid, mensagem } = await validadeToken(token));
    } catch (err) {
        console.error("Ocorreu um erro ao validar o token: ", err)
        res.status(500).json({"mensagem": "Ocorreu um erro interno, contate o adm do sistema"});
    }

    if (!tokenIsValid) {
       return res.status(401).json({"mensagem": mensagem});
    }

    next();
};