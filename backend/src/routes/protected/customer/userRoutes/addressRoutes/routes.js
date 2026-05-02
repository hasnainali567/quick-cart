import { Router } from "express";
import { addAddress, getAddresses } from "../../../../../controllers/customerController/userController/addressController/address.controller.js";
import { deleteAddress, setDefaultAddress, updateAddress } from "../../../../../controllers/customerController/userController/addressController/address.controller.js";

const addressRouter = Router();

addressRouter.get('/', getAddresses)
addressRouter.post('/', addAddress)
addressRouter.patch('/:id', updateAddress)
addressRouter.delete('/:id', deleteAddress)
addressRouter.patch('/:id/default', setDefaultAddress)

export default addressRouter;