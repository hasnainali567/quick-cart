import { Router } from "express";
import { addToCart, clearCart, deleteCartItem, getUserCart, updateItemQuatity } from "../../../../controllers/customerController/userController/cartController/cart.controller";

const cartRouter = Router();

cartRouter.get('/', getUserCart);
cartRouter.post('/', addToCart)
cartRouter.patch('/:itemId', updateItemQuatity)
cartRouter.delete('/:itemId', deleteCartItem)
cartRouter.delete('/', clearCart)

export default cartRouter;