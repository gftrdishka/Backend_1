const loginRegex = /^[а-яё]{6,}$/i; // кириллица минимум 6 символов
const fullNameRegex = /^[а-яё\s]+$/i;
const phoneRegex = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration(data) {
  const errors = {};

  if (!data.login || !loginRegex.test(data.login)) {
    errors.login = 'Логин должен содержать минимум 6 букв кириллицы.';
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов.';
  }
  if (!data.fullName || !fullNameRegex.test(data.fullName)) {
    errors.fullName = 'ФИО должно содержать только кириллицу и пробелы.';
  }
  if (!data.phone || !phoneRegex.test(data.phone)) {
    errors.phone = 'Телефон должен быть в формате +7(XXX)-XXX-XX-XX.';
  }
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Неверный формат электронной почты.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = { validateRegistration };
