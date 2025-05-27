import axios from "axios";
import { refreshToken } from "./Logout";

// Criar interceptor para requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Criar interceptor para responses
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se receber erro 401 (token expirado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar fazer refresh do token
        const newToken = await refreshToken();

        // Atualizar o header da requisição original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Reenviar a requisição original
        return axios(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, redirecionar para login
        console.error("Falha no refresh automático do token:", refreshError);
        window.location.href = `${process.env.PUBLIC_URL}/login`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
