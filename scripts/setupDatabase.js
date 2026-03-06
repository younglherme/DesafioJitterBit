const { Client } = require("pg");
require("dotenv").config();

async function setupDatabase() {
  // Conectar ao banco de dados existente
  const dbClient = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12345",
    database: process.env.DB_NAME || "bdjitterbit",
  });

  try {
    await dbClient.connect();
    console.log(`Conectado ao banco '${process.env.DB_NAME || "bdjitterbit"}'`);

    // Dropar tabelas se existirem
    console.log("🗑️  Removendo tabelas antigas...");
    await dbClient.query('DROP TABLE IF EXISTS "Items" CASCADE');
    await dbClient.query('DROP TABLE IF EXISTS "Order" CASCADE');
    console.log("✅ Tabelas antigas removidas");

    // Criar a tabela Order
    const createOrderTableQuery = `
      CREATE TABLE "Order" (
        "orderId" SERIAL PRIMARY KEY,
        "value" DECIMAL(10, 2) NOT NULL,
        "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await dbClient.query(createOrderTableQuery);
    console.log('✅ Tabela "Order" criada com sucesso');

    // Criar a tabela Items
    const createItemsTableQuery = `
      CREATE TABLE "Items" (
        "itemId" SERIAL PRIMARY KEY,
        "orderId" INTEGER NOT NULL,
        "productId" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE
      );
    `;

    await dbClient.query(createItemsTableQuery);
    console.log('✅ Tabela "Items" criada com sucesso');

    // Criar índices
    await dbClient.query('CREATE INDEX idx_order_id ON "Items"("orderId")');
    await dbClient.query('CREATE INDEX idx_product_id ON "Items"("productId")');
    await dbClient.query(
      'CREATE INDEX idx_creation_date ON "Order"("creationDate")',
    );
    console.log("✅ Índices criados com sucesso");

    // Inserir dados de exemplo na tabela Order
    const insertOrderQuery = `
      INSERT INTO "Order" ("value", "creationDate") 
      VALUES 
        ($1, CURRENT_TIMESTAMP),
        ($2, CURRENT_TIMESTAMP),
        ($3, CURRENT_TIMESTAMP)
      RETURNING "orderId"
    `;

    const orderResult = await dbClient.query(
      insertOrderQuery,
      [3500.0, 250.0, 1200.0],
    );
    console.log("Dados de exemplo inseridos na tabela Order");

    // Inserir dados de exemplo na tabela Items
    const orderIds = orderResult.rows.map((row) => row.orderId);

    await dbClient.query(
      'INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, 101, 1, 3500.00)',
      [orderIds[0]],
    );
    await dbClient.query(
      'INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, 102, 2, 50.00)',
      [orderIds[1]],
    );
    await dbClient.query(
      'INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, 103, 1, 150.00)',
      [orderIds[1]],
    );
    await dbClient.query(
      'INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, 104, 1, 1200.00)',
      [orderIds[2]],
    );
    console.log("Dados de exemplo inseridos na tabela Items");

    // Verificar dados
    const orderCount = await dbClient.query('SELECT COUNT(*) FROM "Order"');
    const itemCount = await dbClient.query('SELECT COUNT(*) FROM "Items"');
    console.log(`\n Total de pedidos: ${orderCount.rows[0].count}`);
    console.log(` Total de items: ${itemCount.rows[0].count}`);

    await dbClient.end();

    console.log("\n Setup do banco de dados concluído com sucesso!");
    console.log("  Você já pode iniciar o servidor com: npm start");
  } catch (error) {
    console.error(" Erro durante o setup:", error.message);
    process.exit(1);
  }
}

setupDatabase();
