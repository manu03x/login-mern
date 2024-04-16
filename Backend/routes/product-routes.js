const express = require('express');
const { signup, login, verifyToken, getUser, isAdmin , toggleUserStatus, changeUserRole, refreshToken, logout, getAllUsers, updateUser} = require('../controller/user-controller');

const { addProduct, deleteProduct, updateProduct, getProducts } = require('../controller/product-controller');

const productsRouter = express.Router();

productsRouter.post("/add", verifyToken, isAdmin, addProduct)
productsRouter.delete("/delete", verifyToken, isAdmin, deleteProduct)
productsRouter.put("/update", verifyToken, isAdmin, updateProduct)
productsRouter.get("/", verifyToken, getProducts)


module.exports = productsRouter;