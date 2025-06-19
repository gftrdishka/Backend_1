const express = require('express');
const router = express.Router();
const { register, login, adminLogin } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Регистрация и обычный вход
router.post('/register', register);
router.post('/login', login);

// Вход в админ-панель — только для авторизованных
router.post('/admin-login', authMiddleware, adminLogin);

module.exports = router;
