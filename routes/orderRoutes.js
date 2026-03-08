const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByNumber,
  listAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     description: Cria um novo pedido com seus itens associados
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             valorTotal: 59.98
 *             dataCriacao: "2026-03-07T10:30:00.000Z"
 *             items:
 *               - idItem: 101
 *                 quantidadeItem: 2
 *                 valorItem: 29.99
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/order", authenticateToken, createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     description: Retorna uma lista com todos os pedidos e seus itens
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: integer
 *                         example: 1
 *                       value:
 *                         type: number
 *                         example: 59.98
 *                       creationDate:
 *                         type: string
 *                         format: date-time
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao listar pedidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/order/list", authenticateToken, listAllOrders);

/**
 * @swagger
 * /order/{orderNumber}:
 *   get:
 *     summary: Buscar pedido por número
 *     description: Retorna um pedido específico pelo seu número
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número do pedido
 *         example: 1
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: integer
 *                       example: 1
 *                     value:
 *                       type: number
 *                       example: 59.98
 *                     creationDate:
 *                       type: string
 *                       format: date-time
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao buscar pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/order/:orderNumber", authenticateToken, getOrderByNumber);

/**
 * @swagger
 * /order/{orderNumber}:
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza os dados de um pedido existente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número do pedido a ser atualizado
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 example: 79.98
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao atualizar pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/order/:orderNumber", authenticateToken, updateOrder);

/**
 * @swagger
 * /order/{orderNumber}:
 *   delete:
 *     summary: Deletar pedido
 *     description: Remove um pedido e seus itens
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número do pedido a ser deletado
 *         example: 1
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao deletar pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/order/:orderNumber", authenticateToken, deleteOrder);

module.exports = router;
