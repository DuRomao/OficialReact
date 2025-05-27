
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuração padrão do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// APIs de Usuários
export const usersApi = {
  // Buscar usuários com paginação e filtros
  getUsers: (params) => api.get('/users', { params }),
  
  // Buscar usuário por ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Criar novo usuário
  createUser: (userData) => api.post('/users', userData),
  
  // Atualizar usuário
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Excluir usuário
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Buscar tipos de usuário
  getUserTypes: () => api.get('/user-types'),
  
  // Buscar idiomas
  getLanguages: () => api.get('/languages'),
  
  // Exportar usuários
  exportUsers: (format, data) => api.post(`/users/export/${format}`, data, {
    responseType: 'blob'
  }),
  
  // Exportar todos os usuários
  exportAllUsers: (format) => api.get(`/users/export/${format}/all`, {
    responseType: 'blob'
  }),
  
  // Upload de foto
  uploadPhoto: (userId, photoData) => {
    const formData = new FormData();
    formData.append('photo', photoData);
    return api.post(`/users/${userId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;
