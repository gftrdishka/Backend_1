const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Создание таблиц если нужно
    console.log('Подключение к базе успешно');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (e) {
    console.error('Ошибка подключения к базе:', e);
  }
}

start();
