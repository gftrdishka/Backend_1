const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateRegistration } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

async function register(req, res) {
  try {
    const { login, password, fullName, phone, email } = req.body;
    const { valid, errors } = validateRegistration(req.body);

    if (!valid) return res.status(400).json({ errors });

    // Проверка уникальности
    const loginExists = await User.findOne({ where: { login } });
    if (loginExists) return res.status(400).json({ errors: { login: 'Логин уже занят' } });

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) return res.status(400).json({ errors: { email: 'Email уже зарегистрирован' } });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ login, passwordHash: hash, fullName, phone, email });
    return res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}

async function login(req, res) {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: 'Введите логин и пароль' });

    const user = await User.findOne({ where: { login } });
    if (!user) return res.status(400).json({ message: 'Неверный логин или пароль' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Неверный логин или пароль' });

    // Создаем JWT без статуса admin
    const token = jwt.sign({
      id: user.id,
      login: user.login,
      fullName: user.fullName,
      isAdmin: false,
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Отдельный контроллер для входа администратора
async function adminLogin(req, res) {
  try {
    const { login, password } = req.body;
    // Проверка по жестко заданным admin credentials
    if (login === 'admin' && password === 'gruzovik2024') {
      // Вшиваем статус admin в токен, без создания пользователя в БД
      const token = jwt.sign({
        login: 'admin',
        isAdmin: true,
      }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return res.json({ token });
    }
    return res.status(401).json({ message: 'Неверный логин или пароль администратора' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = { register, login, adminLogin };
