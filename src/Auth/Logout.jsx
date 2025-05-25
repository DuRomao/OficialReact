import { useNavigate } from "react-router-dom";
import { clearMenuCache } from "../Layout/Sidebar/Menu";

// auth/Logout.js
const LogoutSistema = () => {
  const navigate = useNavigate();

  // Limpar todas as informações de autenticação
  localStorage.removeItem("Token");
  localStorage.removeItem("UserFoto");
  localStorage.removeItem("UserName");
  localStorage.removeItem("Authenticated");
  localStorage.setItem("Authenticated", "false");

  // Limpar cache do menu
  clearMenuCache();

  // Redirecionar para página de login
  navigate(`${process.env.PUBLIC_URL}/login`);
};

export default LogoutSistema;