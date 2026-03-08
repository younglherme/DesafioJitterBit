const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "SuaChaveSecretaMuitoLongaEseguraParaAssinaturaDeTokens123456";

/**
 * Middleware para autenticar requisições usando JWT Bearer Token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extrai o token do formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token não fornecido",
      message: "Acesso negado. Token JWT é obrigatório.",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Token inválido",
        message: "O token fornecido é inválido ou expirou.",
      });
    }

    req.user = user;
    next();
  });
}

/**
 * Função para gerar um novo token JWT
 */
function generateToken(payload, expiresIn = "24h") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

module.exports = {
  authenticateToken,
  generateToken,
  SECRET_KEY,
};
