const { generateToken } = require("../middleware/authMiddleware");

/**
 * Usuários padrão teste
 */
const USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "gluizdasilvadev@gmail.com",
    role: "admin",
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    email: "gluizdasilvadev@gmail.com",
    role: "user",
  },
];

/**
 * Login - Gera um token JWT para o usuário
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validar entrada
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Credenciais incompletas",
        message: "Username e password são obrigatórios",
      });
    }

    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
        message: "User ou password incorretos",
      });
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      success: false,
      error: "Erro no servidor",
      message: error.message,
    });
  }
}

/**
 * Validar token
 */
async function validateToken(req, res) {
  res.status(200).json({
    success: true,
    message: "Token válido",
    data: {
      user: req.user,
    },
  });
}

module.exports = {
  login,
  validateToken,
};
