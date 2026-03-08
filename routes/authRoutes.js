const express = require("express");
const router = express.Router();
const { login, validateToken } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário e gerar token JWT
 *     description: Realiza login e retorna um token JWT Bearer para autenticação nas demais rotas
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: admin123
 *           examples:
 *             admin:
 *               summary: Usuário Admin
 *               value:
 *                 username: admin
 *                 password: admin123
 *             user:
 *               summary: Usuário Comum
 *               value:
 *                 username: user
 *                 password: user123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT para autenticação
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: admin
 *                         email:
 *                           type: string
 *                           example: admin@jitterbit.com
 *                         role:
 *                           type: string
 *                           example: admin
 *       400:
 *         description: Credenciais incompletas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validar token JWT
 *     description: Verifica se o token JWT fornecido é válido e retorna os dados do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token válido
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: admin
 *                         email:
 *                           type: string
 *                           example: admin@jitterbit.com
 *                         role:
 *                           type: string
 *                           example: admin
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/validate", authenticateToken, validateToken);

module.exports = router;
