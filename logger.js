import fs from 'fs';
import conectarAoBanco from "./src/config/dbConfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

/**
 * Salva um evento de log na base de dados.
 * @param {string} level - Nível do log (e.g., 'info', 'warn', 'error').
 * @param {string} message - Mensagem descritiva do log.
 */

export default async function saveLog(level, message = {}) {
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    const db = conexao.db("Imersao-instabytes");
    const colecao = db.collection("errors");
    return colecao.insertOne(logEntry);

  } catch (error) {
    // Como fallback, salva no arquivo de log local
    fs.appendFile('error.log', `${JSON.stringify(logEntry)}\n`, (err) => {
      if (err) console.error('Erro ao salvar log em arquivo local:', err);
    });
  };
};
