const express = require('express');
const { signup, login, verifyToken, getUser, isAdmin , toggleUserStatus, changeUserRole, refreshToken, logout, getAllUsers, updateUser} = require('../controller/user-controller');

const { addProduct, deleteProduct, updateProduct, getProducts, handlePurchase } = require('../controller/product-controller');

const productsRouter = express.Router();

productsRouter.post("/add", verifyToken, isAdmin, addProduct)
productsRouter.post("/buy", verifyToken, handlePurchase)
productsRouter.delete("/delete/:productId", verifyToken, isAdmin, deleteProduct)
productsRouter.put("/update/:productId", verifyToken, isAdmin, updateProduct)
productsRouter.get("/", verifyToken, getProducts)


module.exports = productsRouter;