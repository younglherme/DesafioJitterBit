const pool = require("../config/database");

// Criar um novo pedido
const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação básica
    if (!valorTotal || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Campos obrigatórios: valorTotal, items (array não vazio)",
      });
    }

    await client.query("BEGIN");

    // Inserir na tabela Order
    const orderQuery = `
      INSERT INTO "Order" ("value", "creationDate")
      VALUES ($1, $2)
      RETURNING "orderId", "value", "creationDate"
    `;

    const orderValues = [
      valorTotal,
      dataCriacao ? new Date(dataCriacao) : new Date(),
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];

    // Inserir os items na tabela Items
    const itemsPromises = items.map(async (item) => {
      const itemQuery = `
        INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
        VALUES ($1, $2, $3, $4)
        RETURNING "itemId", "orderId", "productId", "quantity", "price"
      `;

      const itemValues = [
        order.orderId,
        parseInt(item.idItem),
        item.quantidadeItem,
        item.valorItem,
      ];

      return await client.query(itemQuery, itemValues);
    });

    const itemsResults = await Promise.all(itemsPromises);
    const insertedItems = itemsResults.map((result) => result.rows[0]);

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso",
      data: {
        orderId: order.orderId,
        value: parseFloat(order.value),
        creationDate: order.creationDate,
        items: insertedItems,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({
      error: "Erro ao criar pedido",
      details: error.message,
    });
  } finally {
    client.release();
  }
};

// Obter pedido por ID
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Buscar o pedido
    const orderQuery = 'SELECT * FROM "Order" WHERE "orderId" = $1';
    const orderResult = await pool.query(orderQuery, [orderNumber]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado",
      });
    }

    const order = orderResult.rows[0];

    // Buscar os items do pedido
    const itemsQuery = 'SELECT * FROM "Items" WHERE "orderId" = $1';
    const itemsResult = await pool.query(itemsQuery, [orderNumber]);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        value: parseFloat(order.value),
        creationDate: order.creationDate,
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({
      error: "Erro ao buscar pedido",
      details: error.message,
    });
  }
};

// Listar todos os pedidos
const listAllOrders = async (req, res) => {
  try {
    // Buscar todos os pedidos com seus items usando JOIN
    const query = `
      SELECT 
        o."orderId",
        o."value",
        o."creationDate",
        json_agg(
          json_build_object(
            'itemId', i."itemId",
            'productId', i."productId",
            'quantity', i."quantity",
            'price', i."price"
          )
        ) as items
      FROM "Order" o
      LEFT JOIN "Items" i ON o."orderId" = i."orderId"
      GROUP BY o."orderId", o."value", o."creationDate"
      ORDER BY o."creationDate" DESC
    `;

    const result = await pool.query(query);

    const mappedOrders = result.rows.map((order) => ({
      orderId: order.orderId,
      value: parseFloat(order.value),
      creationDate: order.creationDate,
      items: order.items,
    }));

    res.status(200).json({
      success: true,
      count: mappedOrders.length,
      data: mappedOrders,
    });
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({
      error: "Erro ao listar pedidos",
      details: error.message,
    });
  }
};

// Atualizar pedido
const updateOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orderNumber } = req.params;
    const { valorTotal, dataCriacao, items } = req.body;

    // Verificar se o pedido existe
    const checkQuery = 'SELECT * FROM "Order" WHERE "orderId" = $1';
    const checkResult = await client.query(checkQuery, [orderNumber]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado",
      });
    }

    await client.query("BEGIN");

    // Construir query de atualização dinâmica para Order
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (valorTotal !== undefined) {
      updates.push(`"value" = $${paramCount}`);
      values.push(valorTotal);
      paramCount++;
    }

    if (dataCriacao !== undefined) {
      updates.push(`"creationDate" = $${paramCount}`);
      values.push(new Date(dataCriacao));
      paramCount++;
    }

    if (updates.length > 0) {
      values.push(orderNumber);
      const updateQuery = `
        UPDATE "Order" 
        SET ${updates.join(", ")}
        WHERE "orderId" = $${paramCount}
        RETURNING *
      `;
      await client.query(updateQuery, values);
    }

    // Se items foram fornecidos, atualizar
    if (items && Array.isArray(items)) {
      // Deletar items existentes
      await client.query('DELETE FROM "Items" WHERE "orderId" = $1', [
        orderNumber,
      ]);

      // Inserir novos items
      for (const item of items) {
        const itemQuery = `
          INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
          VALUES ($1, $2, $3, $4)
        `;
        await client.query(itemQuery, [
          orderNumber,
          parseInt(item.idItem),
          item.quantidadeItem,
          item.valorItem,
        ]);
      }
    }

    // Buscar dados atualizados
    const orderResult = await client.query(checkQuery, [orderNumber]);
    const itemsResult = await client.query(
      'SELECT * FROM "Items" WHERE "orderId" = $1',
      [orderNumber],
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Pedido atualizado com sucesso",
      message: "Pedido atualizado com sucesso",
      data: {
        orderId: orderResult.rows[0].orderId,
        value: parseFloat(orderResult.rows[0].value),
        creationDate: orderResult.rows[0].creationDate,
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({
      error: "Erro ao atualizar pedido",
      details: error.message,
    });
  } finally {
    client.release();
  }
};

// Deletar pedido
const deleteOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Buscar pedido e items antes de deletar
    const orderQuery = 'SELECT * FROM "Order" WHERE "orderId" = $1';
    const orderResult = await pool.query(orderQuery, [orderNumber]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado",
      });
    }

    const itemsQuery = 'SELECT * FROM "Items" WHERE "orderId" = $1';
    const itemsResult = await pool.query(itemsQuery, [orderNumber]);

    // Deletar pedido (items serão deletados em cascata)
    const deleteQuery = 'DELETE FROM "Order" WHERE "orderId" = $1';
    await pool.query(deleteQuery, [orderNumber]);

    res.status(200).json({
      success: true,
      message: "Pedido deletado com sucesso",
      data: {
        orderId: orderResult.rows[0].orderId,
        value: parseFloat(orderResult.rows[0].value),
        creationDate: orderResult.rows[0].creationDate,
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res.status(500).json({
      error: "Erro ao deletar pedido",
      details: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderByNumber,
  listAllOrders,
  updateOrder,
  deleteOrder,
};
