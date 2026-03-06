-- Scripts do banco de dados.


CREATE TABLE "Order" (
    "orderId" SERIAL PRIMARY KEY,
    "value" DECIMAL(10, 2) NOT NULL,
    "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Items" (
    "itemId" SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE
);


INSERT INTO "Order" ("value", "creationDate") 
VALUES 
    (3500.00, CURRENT_TIMESTAMP),
    (250.00, CURRENT_TIMESTAMP),
    (1200.00, CURRENT_TIMESTAMP);

INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
VALUES
    (1, 101, 1, 3500.00),
    (2, 102, 2, 50.00),
    (2, 103, 1, 150.00),
    (3, 104, 1, 1200.00);
