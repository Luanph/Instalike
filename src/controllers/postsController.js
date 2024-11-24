import fs from 'fs';
import {getAllPosts, createNewPost, updatePost} from "../models/postsModel.js";
import GenerateDescriptionWithGemini from '../services/serviceGemini.js';

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
