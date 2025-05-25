import { clearMenuCache } from "../Layout/Sidebar/Menu";

// auth/Logout.js
const LogoutSistema = () => {
  // Limpar todas as informações de autenticação
  localStorage.removeItem("Token");
  localStorage.removeItem("UserFoto");
  localStorage.removeItem("UserName");
  localStorage.removeItem("Authenticated");
  localStorage.setItem("Authenticated", "false");

  // Limpar cache do menu
  clearMenuCache();

};

export default LogoutSistema;