const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "bdjitterbit",
});

// Testar conexão
pool.on("connect", () => {
  console.log("🔗 Conectado ao banco de dados PostgreSQL");
});

pool.on("error", (err) => {
  console.error(" Erro inesperado no banco de dados:", err);
  process.exit(-1);
});

module.exports = pool;
