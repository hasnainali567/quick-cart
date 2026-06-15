import { Router } from "express";
import { acceptOrder, getOrderbyId, getOrders, markOrderPrepared, rejectOrder } from "../../../../controllers/storeController/order/order.controller.js";

const orderRouter = Router();

orderRouter.get('/', getOrders);
orderRouter.get('/:orderId', getOrderbyId);
orderRouter.get('/:orderId/accept', acceptOrder);
orderRouter.patch('/:orderId/prepared', markOrderPrepared);
orderRouter.patch('/:orderId/reject', rejectOrder);
// orderRouter.patch('/:orderId/pickup/:driverId', askDriverToPickup);


export default orderRouter;