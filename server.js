const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Jitterbit - Documentação",
}));

app.get("/", (req, res) => {
  res.json({
    message: "API de Pedidos - Jitterbit",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      "POST /order": "Criar novo pedido",
      "GET /order/:orderNumber": "Obter pedido por número",
      "GET /order/list": "Listar todos os pedidos",
      "PUT /order/:orderNumber": "Atualizar pedido",
      "DELETE /order/:orderNumber": "Deletar pedido",
    },
  });
});

app.use("/", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
  });
});


app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(500).json({
    error: "Erro interno do servidor",
    details: err.message,
  });
});

app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Acesse: http://localhost:${PORT}`);
});

module.exports = app;
