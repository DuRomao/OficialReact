import { clearMenuCache } from "../Layout/Sidebar/Menu";
import axios from "axios";
import { API_URL } from "../Constant";

const LogoutSistema = () => {
  try {
    // Limpar dados de autenticação
    localStorage.removeItem("Token");
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("UserName");
    localStorage.removeItem("UserFoto");

    console.log("Logout realizado com sucesso");
  } catch (error) {
    console.error("Erro durante o logout:", error);
  }
};

// Função para refresh do token
export const refreshToken = async () => {
  try {
    const currentToken = localStorage.getItem("Token");

    if (!currentToken) {
      throw new Error("Token não encontrado");
    }

    const response = await axios.post(
      `${API_URL}/api.php?index=refreshToken`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.data.success && response.data.token) {
      // Atualizar token no localStorage
      localStorage.setItem("Token", response.data.token);
      localStorage.setItem("Authenticated", "true");

      // Atualizar dados do usuário se fornecidos
      if (response.data.user) {
        localStorage.setItem("UserName", response.data.user.UserName || "Usuário");
        localStorage.setItem("UserFoto", response.data.user.UserFoto || "Imagem");
      }

      console.log("Token refreshed com sucesso");
      return response.data.token;
    } else {
      throw new Error("Falha ao refresh do token");
    }
  } catch (error) {
    console.error("Erro no refresh do token:", error);
    LogoutSistema();
    throw error;
  }
};

export default LogoutSistema;