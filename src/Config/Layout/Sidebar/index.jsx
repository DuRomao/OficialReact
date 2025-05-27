import React, { useContext, useEffect, useState } from "react";
import { MENUITEMS } from "./Menu";
import SidebarMenuItems from "./SidebarMenuItems";
import RGLIcon from "../../../assets/img/logo/RGL1_FB.png";
import CustomizerContext from "../../../_helper/Customizer";

const Sidebar = () => {
  const { sidebarToggle } = useContext(CustomizerContext);
  const [mainMenu, setMainMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuData = await MENUITEMS();
        console.log("Menu carregado:", menuData); // Debug log
        setMainMenu(menuData);
        setMenuItems(menuData);
      } catch (error) {
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
                src={ RGLIcon }
                alt=""
              />
              <img
                className="img-fluid for-dark"
                src={ RGLIcon }
                alt=""
              />
            </a>
            <div className="back-btn">
              <i className="fa fa-angle-left"></i>
            </div>
            <div className="toggle-sidebar">
              <i
                className="status_toggle middle sidebar-toggle"
                data-feather="grid"
              ></i>
            </div>
          </div>
          <div className="logo-icon-wrapper">
            <a href="index.html">
              <img className="img-fluid" src={ RGLIcon } alt="" />
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
                      src={ RGLIcon }
                      alt=""
                    />
                  </a>
                  <div className="mobile-back text-end">
                    <span>Back</span>
                    <i
                      className="fa fa-angle-right ps-2"
                      aria-hidden="true"
                    ></i>
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
              src={ RGLIcon }
              alt=""
            />
            <img
              className="img-fluid for-dark"
              src={ RGLIcon }
              alt=""
            />
          </a>
          <div className="back-btn">
            <i className="fa fa-angle-left"></i>
          </div>
          <div className="toggle-sidebar">
            <i
              className="status_toggle middle sidebar-toggle"
              data-feather="grid"
            ></i>
          </div>
        </div>
        <div className="logo-icon-wrapper">
          <a href="index.html">
            <img className="img-fluid" src={ RGLIcon } alt="" />
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
                    src={ RGLIcon }
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
