const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Desafio API - Jitterbit 2026",
      version: "1.0.0",
      description:
        "API desenvolvida com Node, Express e Postgres desenvolvida por Guilherme Silva ",
      contact: {
        name: "Guilherme Silva",
        url: "https://github.com/younglherme",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local",
      },
    ],
    components: {
      schemas: {
        Item: {
          type: "object",
          required: ["idItem", "quantidadeItem", "valorItem"],
          properties: {
            idItem: {
              type: "integer",
              description: "ID do produto",
              example: 101,
            },
            quantidadeItem: {
              type: "number",
              description: "Quantidade do item",
              example: 2,
            },
            valorItem: {
              type: "number",
              format: "float",
              description: "Valor unitário do item",
              example: 29.99,
            },
          },
        },
        Order: {
          type: "object",
          required: ["valorTotal", "items"],
          properties: {
            numeroPedido: {
              type: "integer",
              description: "Número do pedido ",
              example: 1,
            },
            valorTotal: {
              type: "number",
              format: "float",
              description: "Valor total do pedido",
              example: 59.98,
            },
            dataCriacao: {
              type: "string",
              format: "date-time",
              description: "Data de criação do pedido",
              example: "2026-03-07T10:30:00.000Z",
            },
            items: {
              type: "array",
              description: "Lista de itens do pedido",
              items: {
                $ref: "#/components/schemas/Item",
              },
            },
          },
        },
        OrderResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Pedido criado com sucesso",
            },
            data: {
              type: "object",
              properties: {
                orderId: {
                  type: "integer",
                  example: 1,
                },
                value: {
                  type: "number",
                  format: "float",
                  example: 59.98,
                },
                creationDate: {
                  type: "string",
                  format: "date-time",
                  example: "2026-03-07T10:30:00.000Z",
                },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      itemId: {
                        type: "integer",
                        example: 1,
                      },
                      orderId: {
                        type: "integer",
                        example: 1,
                      },
                      productId: {
                        type: "integer",
                        example: 101,
                      },
                      quantity: {
                        type: "number",
                        example: 2,
                      },
                      price: {
                        type: "number",
                        format: "float",
                        example: 29.99,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Erro ao processar requisição",
            },
            details: {
              type: "string",
              example: "Detalhes do erro",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Caminho das  rotas com as anotações
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
