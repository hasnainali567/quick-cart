import { Router } from "express";
import { getUserOrders, placeOrder } from "../../../../controllers/customerController/userController/orderController/order.controller";

const orderRouter = Router();

orderRouter.get('/', getUserOrders);
orderRouter.post('/', placeOrder);
// orderRouter.delete('/:orderId')

export default orderRouter;