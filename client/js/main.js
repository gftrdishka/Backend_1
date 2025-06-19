// main.js - Основной модуль с общими функциями
import { authUtils } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Проверка авторизации на защищенных страницах
  const protectedPages = ['/create-order.html', '/user-requests.html', '/client/admin/index.html', '/cliet/admin/orders.html', '/client/admin/admin-login.html'];
  
  if (protectedPages.includes(window.location.pathname)) {
    authUtils.redirectIfNotAuthenticated();
  }

  // Кнопка выхода
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authUtils.removeToken();
      window.location.href = '/client/auth.html';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
  // Добавляем кнопку админ-панели если пользователь админ
  if (authUtils.isAdmin()) {
    addAdminButton();
  }

  // Обработка кнопки выхода
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authUtils.removeToken();
      window.location.href = '/client/auth.html';
    });
  }
});

function addAdminButton() {
  const nav = document.querySelector('nav ul');
  if (!nav) return;

  const adminBtn = document.createElement('li');
  adminBtn.innerHTML = `
    <a href="/admin/index.html" class="admin-panel-link">
      <i class="fas fa-user-shield"></i> Админ-панель
    </a>
  `;
  
  // Вставляем перед кнопкой выхода или в конец
  const logoutLi = document.querySelector('#logoutLi');
  if (logoutLi) {
    logoutLi.before(adminBtn);
  } else {
    nav.appendChild(adminBtn);
  }
}
});