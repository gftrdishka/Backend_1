const { Request } = require('../models');

// Создание заявки
async function createRequest(req, res) {
  try {
    const { transportDateTime, cargoWeight, cargoDimensions, fromAddress, toAddress, cargoType } = req.body;

    if (!transportDateTime || !cargoWeight || !cargoDimensions || !fromAddress || !toAddress || !cargoType) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    if (cargoType === 'мусор') {
      // Дополнительное уведомление на клиенте (логика на клиенте)
      // Здесь можно только логировать или вернуть предупреждение:
      // Но для простоты оставим это на клиенте
    }

    const request = await Request.create({
      transportDateTime,
      cargoWeight,
      cargoDimensions,
      fromAddress,
      toAddress,
      cargoType,
      userId: req.user.id,
      status: 'Новая',
    });

    res.status(201).json(request);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Получить все заявки текущего пользователя
async function getUserRequests(req, res) {
  try {
    const requests = await Request.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(requests);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Оставить отзыв (только если статус «Выполнено»)
async function leaveFeedback(req, res) {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const request = await Request.findOne({ where: { id, userId: req.user.id } });
    if (!request) return res.status(404).json({ message: 'Заявка не найдена' });

    if (request.status !== 'Выполнено') {
      return res.status(400).json({ message: 'Отзывы можно оставлять только для выполненных заявок' });
    }

    request.feedback = feedback;
    await request.save();

    res.json({ message: 'Отзыв сохранен', request });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = { createRequest, getUserRequests, leaveFeedback };
