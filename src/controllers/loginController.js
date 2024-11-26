import validadeLogin from "../models/loginModel.js";

export default async function validadeLoginUser(req, res) {
    const user = req.body.user;
    const password = req.body.password;
    let { status, userIsAuth, token } = await validadeLogin(user, password);
    
    if (status == 500) return res.status(status).json({ "mensagem": "Não foi possível gerar o token. Ocorreu um erro interno" });

    if (!userIsAuth) {
        return res.status(status).json({"mensagem": "Usuário ou senha incorretos." });
    }
    res.status(status).json({token, "expireIn": "5min"});
};