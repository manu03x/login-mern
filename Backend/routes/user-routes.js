const express = require('express');
const { signup, login, verifyToken, getUser, isAdmin , toggleUserStatus, createAdmin, refreshToken, logout, getAllUsers} = require('../controller/user-controller');

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/refresh", refreshToken, verifyToken, getUser)
router.get("/user", verifyToken, getUser)
router.get("/admin", verifyToken, isAdmin, getUser)
router.get("/users", verifyToken, isAdmin, getAllUsers)
router.put('/admin/toggleStatus/:userId',verifyToken, isAdmin, toggleUserStatus);
router.post('/admin/createAdmin',verifyToken, isAdmin, createAdmin);
router.post('/logout', verifyToken, logout);

module.exports = router;