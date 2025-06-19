const { Request } = require('../models');

// Получить все заявки с пагинацией и фильтрацией по статусу
async function getAllRequests(req, res) {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await Request.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: +limit,
      offset: +offset,
    });

    res.json({
      total: count,
      page: +page,
      pageSize: +limit,
      requests: rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

// Изменить статус заявки
async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Новая', 'В работе', 'Отменена', 'Выполнено'].includes(status)) {
      return res.status(400).json({ message: 'Неверный статус' });
    }

    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Заявка не найдена' });

    request.status = status;
    await request.save();

    res.json({ message: 'Статус заявки обновлен', request });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = { getAllRequests, updateRequestStatus };
