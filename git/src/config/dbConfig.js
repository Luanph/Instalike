import { MongoClient } from 'mongodb';

export default async function conectarAoBanco(stringConexao) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(stringConexao);
        console.log('Conectando ao cluster do banco de dados...');
        await mongoClient.connect();
        console.log('Conectado ao mongodb com sucesso!');

        return mongoClient
    } catch (erro) {
        console.error("Falha ao conectar ao banco de dados.", erro);
        process.exit();
    };
};