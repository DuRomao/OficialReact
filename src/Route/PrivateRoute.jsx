
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Constant";
import Loader from "../Layout/Loader";

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verificar token no servidor
        const response = await axios.get(`${API_URL}/api.php?index=checkAuth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });

        if (response.status === 200 && response.data.valid) {
          setIsAuthenticated(true);
          localStorage.setItem("authenticated", "true");
          
          // Atualizar informações do usuário se fornecidas
          if (response.data.user) {
            localStorage.setItem("Name", response.data.user.name || "");
            localStorage.setItem("profileURL", response.data.user.profileURL || "");
          }
        } else {
          throw new Error("Token inválido");
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        
        // Limpar dados de autenticação inválidos
        setIsAuthenticated(false);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("authToken");
        localStorage.removeItem("login");
        localStorage.removeItem("Name");
        localStorage.removeItem("profileURL");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`${process.env.PUBLIC_URL}/login`} replace />
  );
};

export default PrivateRoute;
