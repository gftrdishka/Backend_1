// auth.js - Модуль для работы с авторизацией
import { authAPI, authUtils } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, есть ли у нас токен при загрузке страницы
  if (authUtils.isAuthenticated()) {
    // Если пользователь авторизован, перенаправляем на главную
    authUtils.redirectIfAuthenticated();
  }

  // Обработка формы регистрации
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
        fullName: document.getElementById('fullname').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
      };

      try {
        const response = await authAPI.register(formData);
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
        window.location.href = 'auth.html';
      } catch (error) {
        // Обработка ошибок валидации
        if (error.message.includes('Ошибка валидации')) {
          const errors = JSON.parse(error.message.split('Ошибка валидации: ')[1]);
          displayValidationErrors(errors);
        } else {
          alert(error.message || 'Ошибка при регистрации');
        }
      }
    });
  }

  // Обработка формы входа
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const login = document.getElementById('login').value;
      const password = document.getElementById('password').value;

      try {
        const { token } = await authAPI.login(login, password);
        authUtils.saveToken(token);
        window.location.href = '/client/index.html';
      } catch (error) {
        alert(error.message || 'Ошибка при входе');
      }
    });
  }

  // Обработка формы входа в админ-панель
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const login = document.getElementById('admin-login').value;
      const password = document.getElementById('admin-password').value;
      const token = authUtils.getToken();

      try {
        const { token: adminToken } = await authAPI.adminLogin(login, password, token);
        authUtils.saveToken(adminToken);
        window.location.href = 'client/admin/index.html';
      } catch (error) {
        alert(error.message || 'Ошибка при входе в админ-панель');
      }
    });
  }

  // Функция для отображения ошибок валидации
  function displayValidationErrors(errors) {
    // Очищаем предыдущие ошибки
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });

    // Показываем новые ошибки
    for (const [field, message] of Object.entries(errors)) {
      const errorElement = document.getElementById(`${field}-error`);
      if (errorElement) {
        errorElement.textContent = message;
      }
    }
  }
});