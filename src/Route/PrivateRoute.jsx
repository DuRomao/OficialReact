import React, { useEffect, useState } from "react";
import { Navigate, Outlet ,useNavigate} from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Constant";
import Loader from "../Layout/Loader";
import LogoutSistema, { refreshToken } from "../Auth/Logout"

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem("Token");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verificar token no servidor
        const response = await axios.get(`${API_URL}/api.php?index=checkAuth`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.status === 200 && response.data.valid) {
          setIsAuthenticated(true);
          localStorage.setItem("Authenticated", "true");
          
          // Configurar refresh automático do token a cada 25 minutos
          const refreshInterval = setInterval(async () => {
            try {
              await refreshToken();
              console.log("Token refreshed automaticamente");
            } catch (error) {
              console.error("Falha no refresh automático:", error);
              clearInterval(refreshInterval);
              navigate(`${process.env.PUBLIC_URL}/login`);
            }
          }, 25 * 60 * 1000); // 25 minutos

          // Limpar intervalo quando componente desmontar
          return () => clearInterval(refreshInterval);
        } else {
          throw new Error("Token inválido");
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        
        // Tentar fazer refresh do token antes de fazer logout
        try {
          await refreshToken();
          setIsAuthenticated(true);
          localStorage.setItem("Authenticated", "true");
          console.log("Token refreshed com sucesso após erro de verificação");
        } catch (refreshError) {
          console.error("Falha no refresh do token:", refreshError);
          LogoutSistema();
          navigate(`${process.env.PUBLIC_URL}/login`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

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
