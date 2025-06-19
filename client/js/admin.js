// admin.js - Модуль для админ-панели
import { adminAPI, authUtils } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Проверяем авторизацию и права администратора
  const token = authUtils.getToken();
  if (!token) {
    window.location.href = '/client/admin/login.html';
    return;
  }
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем права администратора
  authUtils.redirectIfNotAdmin();

  // ... остальной код админ-панели
});
  // Загрузка статистики и заявок
  loadAdminData(token);

  // Обработка фильтров
  const statusFilter = document.getElementById('status-filter');
  const dateFilter = document.getElementById('date-filter');
  const applyFiltersBtn = document.querySelector('.filters button');
  
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const status = statusFilter.value !== 'all' ? statusFilter.value : null;
      const date = dateFilter.value;
      loadRequestsTable(token, 1, 10, status, date);
    });
  }

  // Обработка изменения статуса заявки
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('save-status-btn')) {
      const row = e.target.closest('tr');
      const requestId = row.dataset.requestId;
      const statusSelect = row.querySelector('.status-change');
      const status = statusSelect.value;

      try {
        await adminAPI.updateRequestStatus(requestId, status, token);
        alert('Статус заявки обновлен');
        loadRequestsTable(token);
      } catch (error) {
        alert(error.message || 'Ошибка при обновлении статуса');
      }
    }
  });

  // Функция загрузки данных для админ-панели
  async function loadAdminData(token) {
    try {
      // Здесь можно загрузить статистику и другие данные
      await loadRequestsTable(token);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      if (error.message === 'Доступ запрещен') {
        window.location.href = '/client/admin/login.html';
      }
    }
  }

  // Функция загрузки таблицы заявок
  async function loadRequestsTable(token, page = 1, limit = 10, status = null, date = null) {
    try {
      const { requests, total } = await adminAPI.getAllRequests(page, limit, status, token);
      renderRequestsTable(requests);
      renderPagination(total, page, limit);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  }

  // Функция отображения таблицы заявок
  function renderRequestsTable(requests) {
    const tbody = document.querySelector('.orders-table tbody');
    if (!tbody) return;

    tbody.innerHTML = requests.map(request => `
      <tr data-request-id="${request.id}">
        <td>#${request.id}</td>
        <td>${request.User?.fullName || 'Неизвестно'}</td>
        <td>${new Date(request.transportDateTime).toLocaleDateString()}</td>
        <td>${request.cargoType}</td>
        <td><span class="status ${getStatusClass(request.status)}">${request.status}</span></td>
        <td>
          <select class="status-change">
            <option value="Новая" ${request.status === 'Новая' ? 'selected' : ''}>Новая</option>
            <option value="В работе" ${request.status === 'В работе' ? 'selected' : ''}>В работе</option>
            <option value="Отменена" ${request.status === 'Отменена' ? 'selected' : ''}>Отменить</option>
            <option value="Выполнено" ${request.status === 'Выполнено' ? 'selected' : ''}>Завершить</option>
          </select>
          <button class="btn-small save-status-btn">Сохранить</button>
        </td>
      </tr>
    `).join('');
  }

  // Функция для отображения пагинации
  function renderPagination(total, currentPage, limit) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(total / limit);
    
    let paginationHTML = '';
    if (currentPage > 1) {
      paginationHTML += `<button class="btn-small prev-page"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    paginationHTML += `<span>Страница ${currentPage} из ${totalPages}</span>`;
    
    if (currentPage < totalPages) {
      paginationHTML += `<button class="btn-small next-page"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    pagination.innerHTML = paginationHTML;

    // Обработка кликов по пагинации
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        loadRequestsTable(token, currentPage - 1, limit);
      });
    }
    
    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        loadRequestsTable(token, currentPage + 1, limit);
      });
    }
  }

  // Функция для получения класса статуса
  function getStatusClass(status) {
    const statusClasses = {
      'Новая': 'new',
      'В работе': 'in-progress',
      'Отменена': 'canceled',
      'Выполнено': 'completed',
    };
    return statusClasses[status] || '';
  }
});