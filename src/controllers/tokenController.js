import validadeToken from "../models/tokenModel.js";

export default async function authenticateToken(req, res, next) {
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