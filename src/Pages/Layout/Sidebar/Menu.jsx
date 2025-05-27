
import axios from "axios";
import { API_URL } from "../../../Config/Constant";

// Cache para armazenar o menu
let menuCache = null;
let menuCacheTime = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos em millisegundos

export const MENUITEMS = async (forceRefresh = false) => {
  try {
    // Verificar se temos cache válido e não é refresh forçado
    if (!forceRefresh && menuCache && menuCacheTime) {
      const now = Date.now();
      if (now - menuCacheTime < CACHE_DURATION) {
        return menuCache;
      }
    }

    const token = localStorage.getItem("Token");

    if (!token) {
      console.warn("Token não encontrado. Usuário não autenticado.");
      return [];
    }

    const response = await axios.post(`${API_URL}/api.php?index=menu`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    
    // Verificar se a resposta tem a estrutura esperada
    if (response.data && response.data.menu) {
      let menuData;
      
      // Verificar se menu é um array ou um objeto único
      if (Array.isArray(response.data.menu)) {
        // Se for um array, usar diretamente
        menuData = response.data.menu.map(menuItem => ({
          menutitle: menuItem.menutitle || "General",
          menucontent: menuItem.menucontent || "",
          Items: menuItem.Items || []
        }));
      } else {
        // Se for um objeto único, transformar em array (compatibilidade com formato antigo)
        menuData = [{
          menutitle: response.data.menu.menutitle || "General",
          menucontent: response.data.menu.menucontent || "",
          Items: response.data.menu.Items || []
        }];
      }

      // Atualizar cache
      menuCache = menuData;
      menuCacheTime = Date.now();
      
      return menuData;
    } else {
      console.error("Estrutura de menu inválida recebida da API");
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar o menu:", error);
    
    // Se houver erro e temos cache, retornar cache
    if (menuCache) {
      console.warn("Usando menu em cache devido ao erro na API");
      return menuCache;
    }
    
    return [];
  }
};

// Função para limpar cache (útil no logout)
export const clearMenuCache = () => {
  menuCache = null;
  menuCacheTime = null;
};

// Função para refresh manual do menu
export const refreshMenu = () => {
  return MENUITEMS(true);
};
