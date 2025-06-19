// requests.js - Модуль для работы с заявками
import { requestAPI, authUtils } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Проверяем авторизацию
  authUtils.redirectIfNotAuthenticated();

  // Обработка формы создания заявки
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        transportDateTime: document.getElementById('date').value,
        cargoWeight: parseFloat(document.getElementById('weight').value),
        cargoDimensions: document.getElementById('dimensions').value,
        fromAddress: document.getElementById('from').value,
        toAddress: document.getElementById('to').value,
        cargoType: document.getElementById('cargo-type').value,
      };

      try {
        const token = authUtils.getToken();
        await requestAPI.createRequest(formData, token);
        alert('Заявка успешно создана!');
        window.location.href = '/client/my-requests.html';
      } catch (error) {
        alert(error.message || 'Ошибка при создании заявки');
      }
    });

    // Обработка выбора типа груза "мусор"
    const cargoTypeSelect = document.getElementById('cargo-type');
    const trashNotification = document.getElementById('trash-notification');
    
    if (cargoTypeSelect && trashNotification) {
      cargoTypeSelect.addEventListener('change', (e) => {
        trashNotification.style.display = e.target.value === 'мусор' ? 'flex' : 'none';
      });
    }
  }

  // Загрузка списка заявок пользователя
  const userRequestsContainer = document.getElementById('userRequests');
  if (userRequestsContainer) {
    loadUserRequests();
  }

  // Обработка формы отзыва
  const feedbackForms = document.querySelectorAll('.feedback-form');
  feedbackForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const requestId = form.dataset.requestId;
      const feedback = form.querySelector('textarea').value;
      
      try {
        const token = authUtils.getToken();
        await requestAPI.leaveFeedback(requestId, feedback, token);
        alert('Отзыв успешно сохранен!');
        loadUserRequests();
      } catch (error) {
        alert(error.message || 'Ошибка при сохранении отзыва');
      }
    });
  });

  // Функция загрузки заявок пользователя
  async function loadUserRequests() {
    try {
      const token = authUtils.getToken();
      const requests = await requestAPI.getUserRequests(token);
      renderUserRequests(requests);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  }

  // Функция отображения заявок пользователя
  function renderUserRequests(requests) {
    const container = document.getElementById('userRequests');
    if (!container) return;

    if (requests.length === 0) {
      container.innerHTML = '<p>У вас пока нет заявок</p>';
      return;
    }

    container.innerHTML = requests.map(request => `
      <div class="request-card">
        <h3>Заявка #${request.id}</h3>
        <p><strong>Дата:</strong> ${new Date(request.transportDateTime).toLocaleString()}</p>
        <p><strong>Тип груза:</strong> ${request.cargoType}</p>
        <p><strong>Статус:</strong> <span class="status ${getStatusClass(request.status)}">${request.status}</span></p>
        
        ${request.status === 'Выполнено' && !request.feedback ? `
          <form class="feedback-form" data-request-id="${request.id}">
            <textarea placeholder="Оставьте отзыв о качестве услуг" required></textarea>
            <button type="submit" class="btn">Отправить отзыв</button>
          </form>
        ` : ''}
        
        ${request.feedback ? `<p><strong>Ваш отзыв:</strong> ${request.feedback}</p>` : ''}
      </div>
    `).join('');
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