import React, { useContext, useEffect, useState } from "react";
import { MENUITEMS } from "./Menu";
import SidebarMenuItems from "./SidebarMenuItems";
import CustomizerContext from "../../../_helper/Customizer";

const Sidebar = () => {
  const { sidebarToggle } = useContext(CustomizerContext);
  const [mainMenu, setMainMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    console.log("=== SIDEBAR useEffect INICIADO ===");
    
    const fetchMenu = async () => {
      try {
        console.log("Chamando MENUITEMS...");
        const menuData = await MENUITEMS();
        
        console.log("=== DADOS RECEBIDOS NO SIDEBAR ===");
        console.log("menuData:", menuData);
        console.log("Tipo:", typeof menuData);
        console.log("É array?", Array.isArray(menuData));
        console.log("Length:", menuData?.length);
        console.log("Primeiro item:", menuData?.[0]);
        
        if (menuData && menuData.length > 0) {
          console.log("Definindo menu com dados:", menuData);
          setMainMenu(menuData);
          setMenuItems(menuData);
        } else {
          console.warn("Menu vazio ou inválido recebido");
          setMainMenu([]);
          setMenuItems([]);
        }
        
        console.log("States atualizados - mainMenu e menuItems definidos");
        
      } catch (error) {
        console.error("=== ERRO NO SIDEBAR ===");
        console.error("Erro ao carregar o menu:", error);
        // Em caso de erro, usar um menu vazio ou padrão
        setMainMenu([]);
        setMenuItems([]);
      }
    };

    fetchMenu();
  }, []);

  const setNavActive = (item) => {
    if (!item.active) {
      menuItems.map((menuSection) => {
        menuSection.Items.filter((menuItem) => {
          if (menuSection.Items.includes(item)) menuItem.active = false;
          if (!menuItem.children) return false;
          menuItem.children.forEach((child) => {
            if (menuItem.children.includes(item)) {
              child.active = false;
            }
            if (!child.children) return false;
            child.children.forEach((grandChild) => {
              if (child.children.includes(item)) {
                grandChild.active = false;
              }
            });
          });
          return menuItem;
        });
        return menuSection;
      });
    }
    item.active = !item.active;
    setMainMenu([...menuItems]);
  };

  const activeClass = () => {};

  // Se não há dados do menu ainda, mostrar loading ou menu vazio
  if (!mainMenu || mainMenu.length === 0) {
    return (
      <div className={`sidebar-wrapper ${sidebarToggle ? "close_icon" : ""}`}>
        <div>
          <div className="logo-wrapper">
            <a href="index.html">
              <img
                className="img-fluid for-light"
                src={require("../../../assets/images/logo/logo.png")}
                alt=""
              />
              <img
                className="img-fluid for-dark"
                src={require("../../../assets/images/logo/logo_dark.png")}
                alt=""
              />
            </a>
            <div className="back-btn">
              <i className="fa fa-angle-left"></i>
            </div>
            <div className="toggle-sidebar">
              <i className="status_toggle middle sidebar-toggle" data-feather="grid"></i>
            </div>
          </div>
          <div className="logo-icon-wrapper">
            <a href="index.html">
              <img
                className="img-fluid"
                src={require("../../../assets/images/logo/logo-icon.png")}
                alt=""
              />
            </a>
          </div>
          <nav className="sidebar-main">
            <div className="left-arrow" id="left-arrow">
              <i data-feather="arrow-left"></i>
            </div>
            <div
              id="sidebar-menu"
              style={{ marginRight: "0px", paddingRight: "0px" }}
            >
              <ul className="sidebar-links" id="simple-bar">
                <li className="back-btn">
                  <a href="index.html">
                    <img
                      className="img-fluid"
                      src={require("../../../assets/images/logo/logo-icon.png")}
                      alt=""
                    />
                  </a>
                  <div className="mobile-back text-end">
                    <span>Back</span>
                    <i className="fa fa-angle-right ps-2" aria-hidden="true"></i>
                  </div>
                </li>
                <li className="sidebar-list">
                  <span>Carregando menu...</span>
                </li>
              </ul>
            </div>
            <div className="right-arrow" id="right-arrow">
              <i data-feather="arrow-right"></i>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar-wrapper ${sidebarToggle ? "close_icon" : ""}`}>
      <div>
        <div className="logo-wrapper">
          <a href="index.html">
            <img
              className="img-fluid for-light"
              src={require("../../../assets/images/logo/logo.png")}
              alt=""
            />
            <img
              className="img-fluid for-dark"
              src={require("../../../assets/images/logo/logo_dark.png")}
              alt=""
            />
          </a>
          <div className="back-btn">
            <i className="fa fa-angle-left"></i>
          </div>
          <div className="toggle-sidebar">
            <i className="status_toggle middle sidebar-toggle" data-feather="grid"></i>
          </div>
        </div>
        <div className="logo-icon-wrapper">
          <a href="index.html">
            <img
              className="img-fluid"
              src={require("../../../assets/images/logo/logo-icon.png")}
              alt=""
            />
          </a>
        </div>
        <nav className="sidebar-main">
          <div className="left-arrow" id="left-arrow">
            <i data-feather="arrow-left"></i>
          </div>
          <div
            id="sidebar-menu"
            style={{ marginRight: "0px", paddingRight: "0px" }}
          >
            <ul className="sidebar-links" id="simple-bar">
              <li className="back-btn">
                <a href="index.html">
                  <img
                    className="img-fluid"
                    src={require("../../../assets/images/logo/logo-icon.png")}
                    alt=""
                  />
                </a>
                <div className="mobile-back text-end">
                  <span>Back</span>
                  <i className="fa fa-angle-right ps-2" aria-hidden="true"></i>
                </div>
              </li>

              <SidebarMenuItems
                menuItems={mainMenu}
                setMainMenu={setMainMenu}
                setNavActive={setNavActive}
                activeClass={activeClass}
              />
            </ul>
          </div>
          <div className="right-arrow" id="right-arrow">
            <i data-feather="arrow-right"></i>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;