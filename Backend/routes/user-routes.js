const express = require('express');
const { signup, login, verifyToken, getUser, isAdmin , toggleUserStatus, changeUserRole, refreshToken, logout, getAllUsers, updateUser} = require('../controller/user-controller');

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/refresh", refreshToken, verifyToken, getUser)
router.get("/user", verifyToken, getUser)
router.put('/user/:userId', verifyToken ,updateUser);
router.get("/admin", verifyToken, isAdmin, getUser)
router.get("/users", verifyToken, isAdmin, getAllUsers)
router.put('/admin/toggleStatus/:userId',verifyToken, isAdmin, toggleUserStatus);
router.put('/admin/changeRole/:userId',verifyToken, isAdmin, changeUserRole);
router.post('/logout', verifyToken, logout);

module.exports = router;