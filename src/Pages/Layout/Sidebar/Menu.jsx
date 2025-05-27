
import axios from "axios";
import { API_URL } from "../../../Config/Constant";

// Cache para armazenar o menu
let menuCache = null;
let menuCacheTime = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos em millisegundos

export const MENUITEMS = async (forceRefresh = false) => {
  console.log("=== MENUITEMS INICIADO ===");
  console.log("forceRefresh:", forceRefresh);
  console.log("menuCache:", menuCache);
  console.log("menuCacheTime:", menuCacheTime);
  
  try {
    // Verificar se temos cache válido e não é refresh forçado
    if (!forceRefresh && menuCache && menuCacheTime) {
      const now = Date.now();
      if (now - menuCacheTime < CACHE_DURATION) {
        console.log("MENUITEMS - Usando menu do cache:", menuCache);
        return menuCache;
      }
    }

    const token = localStorage.getItem("Token");
    console.log("Token encontrado:", token ? "SIM" : "NÃO");
    console.log("API_URL:", API_URL);

    if (!token) {
      console.warn("Token não encontrado. Usuário não autenticado.");
      return [];
    }

    console.log("MENUITEMS - Fazendo requisição para a API...");
    console.log("URL da requisição:", `${API_URL}/api.php?index=menu`);
    
    const response = await axios.post(`${API_URL}/api.php?index=menu`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    
    console.log("=== RESPOSTA COMPLETA DA API ===");
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:", response.data);
    console.log("Type of response.data:", typeof response.data);
    console.log("response.data.menu:", response.data?.menu);
    console.log("=== FIM RESPOSTA ===");
    
    // Verificar se a resposta tem a estrutura esperada
    console.log("=== VERIFICANDO ESTRUTURA ===");
    console.log("response.data existe?", !!response.data);
    console.log("response.data.menu existe?", !!response.data?.menu);
    
    if (response.data && response.data.menu) {
      let menuData;
      
      console.log("Tipo de response.data.menu:", typeof response.data.menu);
      console.log("É array?", Array.isArray(response.data.menu));
      console.log("Conteúdo de response.data.menu:", JSON.stringify(response.data.menu, null, 2));
      
      // Verificar se menu é um array ou um objeto único
      if (Array.isArray(response.data.menu)) {
        console.log("MENUITEMS - Menu é um array com", response.data.menu.length, "itens");
        console.log("Primeiro item do array:", response.data.menu[0]);
        
        // Se for um array, usar diretamente
        menuData = response.data.menu.map((menuItem, index) => {
          console.log(`Processando item ${index}:`, menuItem);
          const processedItem = {
            menutitle: menuItem.menutitle || "General",
            menucontent: menuItem.menucontent || "",
            Items: menuItem.Items || []
          };
          console.log(`Item ${index} processado:`, processedItem);
          return processedItem;
        });
      } else {
        console.log("MENUITEMS - Menu é um objeto único, convertendo para array");
        console.log("Objeto menu:", response.data.menu);
        
        // Se for um objeto único, transformar em array (compatibilidade com formato antigo)
        menuData = [{
          menutitle: response.data.menu.menutitle || "General",
          menucontent: response.data.menu.menucontent || "",
          Items: response.data.menu.Items || []
        }];
      }

      console.log("=== MENU FINAL PROCESSADO ===");
      console.log("menuData:", JSON.stringify(menuData, null, 2));
      console.log("Número de seções:", menuData.length);
      menuData.forEach((section, index) => {
        console.log(`Seção ${index}:`, section.menutitle);
        console.log(`Items da seção ${index}:`, section.Items?.length || 0);
        if (section.Items) {
          section.Items.forEach((item, itemIndex) => {
            console.log(`  Item ${itemIndex}:`, item.title, item.type);
          });
        }
      });

      // Atualizar cache
      menuCache = menuData;
      menuCacheTime = Date.now();
      
      console.log("MENUITEMS - Retornando menuData:", menuData);
      return menuData;
    } else {
      console.error("MENUITEMS - Estrutura de menu inválida!");
      console.error("response.data:", response.data);
      console.error("response.data.menu:", response.data?.menu);
      return [];
    }
  } catch (error) {
    console.error("=== ERRO NO MENUITEMS ===");
    console.error("Tipo do erro:", error.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    console.error("Response status:", error.response?.status);
    console.error("Response data:", error.response?.data);
    console.error("Request config:", error.config);
    
    // Se houver erro e temos cache, retornar cache
    if (menuCache) {
      console.warn("MENUITEMS - Usando menu em cache devido ao erro na API");
      console.log("Cache disponível:", menuCache);
      return menuCache;
    }
    
    console.log("MENUITEMS - Retornando array vazio devido ao erro");
    return [];
  } finally {
    console.log("=== MENUITEMS FINALIZADO ===");
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
