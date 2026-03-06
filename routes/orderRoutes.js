const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByNumber,
  listAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");


router.post("/order", createOrder);

router.get("/order/list", listAllOrders);

router.get("/order/:orderNumber", getOrderByNumber);

router.put("/order/:orderNumber", updateOrder);

router.delete("/order/:orderNumber", deleteOrder);

module.exports = router;
