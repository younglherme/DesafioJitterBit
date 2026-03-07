const { Client } = require("pg");
require("dotenv").config();

async function checkDatabase() {
  const dbClient = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12345",
    database: process.env.DB_NAME || "bdjitterbit",
  });

  try {
    await dbClient.connect();
    console.log(" Conectado ao banco:", process.env.DB_NAME || "bdjitterbit");
    console.log("");

    // Verificar tabelas existentes
    const tablesQuery = `
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `;

    const result = await dbClient.query(tablesQuery);

    console.log(" Tabelas encontradas:");
    console.log("─────────────────────────────────────");
    if (result.rows.length === 0) {
      console.log("  Nenhuma tabela encontrada!");
    } else {
      result.rows.forEach((row) => {
        console.log(`   ${row.table_schema}.${row.table_name}`);
      });
    }
    console.log("");

    // Tentar contar registros se as tabelas existirem
    try {
      const orderCount = await dbClient.query('SELECT COUNT(*) FROM "Order"');
      const itemsCount = await dbClient.query('SELECT COUNT(*) FROM "Items"');
      console.log(" Dados:");
      console.log(`   Pedidos: ${orderCount.rows[0].count}`);
      console.log(`   Items: ${itemsCount.rows[0].count}`);
    } catch (err) {
      console.log("  Erro ao contar registros:", err.message);
    }

    await dbClient.end();
  } catch (error) {
    console.error(" Erro:", error.message);
    process.exit(1);
  }
}

checkDatabase();
