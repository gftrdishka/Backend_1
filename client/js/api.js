  // api.js - Основной модуль для работы с API
  const API_BASE_URL = 'http://localhost:5000/api';

  async function makeRequest(url, method = 'GET', body = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка сервера');
      }

      return data;
    } catch (error) {
      console.error('Ошибка запроса:', error);
      throw error;
    }
  }

  // Функции для работы с API
  export const authAPI = {
    register: async (userData) => {
      return await makeRequest('/auth/register', 'POST', userData);
    },

    login: async (login, password) => {
      return await makeRequest('/auth/login', 'POST', { login, password });
    },

    adminLogin: async (login, password, token) => {
      return await makeRequest('/auth/admin-login', 'POST', { login, password }, token);
    },
  };

  export const requestAPI = {
    createRequest: async (requestData, token) => {
      return await makeRequest('/requests', 'POST', requestData, token);
    },

    getUserRequests: async (token) => {
      return await makeRequest('/requests', 'GET', null, token);
    },

    leaveFeedback: async (requestId, feedback, token) => {
      return await makeRequest(`/requests/${requestId}/feedback`, 'POST', { feedback }, token);
    },
  };

  export const adminAPI = {
    getAllRequests: async (page = 1, limit = 10, status = null, token) => {
      let url = `/admin/requests?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      return await makeRequest(url, 'GET', null, token);
    },

    updateRequestStatus: async (requestId, status, token) => {
      return await makeRequest(`/admin/requests/${requestId}/status`, 'PATCH', { status }, token);
    },
  };

  // Функции для работы с токеном
  export const authUtils = {
    saveToken: (token) => {
      localStorage.setItem('authToken', token);
    },

    getToken: () => {
      return localStorage.getItem('authToken');
    },

    removeToken: () => {
      localStorage.removeItem('authToken');
    },

    isAuthenticated: () => {
      return !!localStorage.getItem('authToken');
    },

    redirectIfAuthenticated: () => {
      if (authUtils.isAuthenticated()) {
        window.location.href = '/client/index.html';
      }
    },

    redirectIfNotAuthenticated: () => {
      if (!authUtils.isAuthenticated()) {
        window.location.href = '/client/auth.html';
      }
    },
    isAdmin: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin === true;
    } catch {
      return false;
    }
  },

  redirectIfNotAdmin: () => {
    if (!authUtils.isAdmin()) {
      window.location.href = '/client/index.html';
    }
  }
  };