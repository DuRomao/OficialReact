import React, { useContext } from "react";
import { Grid } from "react-feather";
import { Link } from "react-router-dom";
import CustomizerContext from "../../../_helper/Customizer";
import { Image } from "../../../AbstractElements";
import RGLIcon from "../../../assets/img/logo/RGL1_FB.png";
import RGLIconDark from "../../../assets/img/logo/RGL1_FB_Dark.png";

const SidebarLogo = () => {
  const { mixLayout, toggleSidebar, toggleIcon, layout, layoutURL } =
    useContext(CustomizerContext);

  const openCloseSidebar = () => {
    toggleSidebar(!toggleIcon);
  };

  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  return (
    <div className="logo-wrapper">
      {layout1 !== "compact-wrapper dark-sidebar" &&
      layout1 !== "compact-wrapper color-sidebar" &&
      mixLayout ? (
        <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}>
          <Image
            attrImage={{
              className: "img-fluid d-inline",
              src: `${RGLIcon}`,
              alt: "",
            }}
          />
        </Link>
      ) : (
        <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}>
          <Image
            attrImage={{
              className: "img-fluid d-inline",
              src: `${require({RGLIconDark})}`,
              alt: "",
            }}
          />
        </Link>
      )}
      <div className="back-btn" onClick={() => openCloseSidebar()}>
        <i className="fa fa-angle-left"></i>
      </div>
      <div className="toggle-sidebar" onClick={openCloseSidebar}>
        <Grid className="status_toggle middle sidebar-toggle" />
      </div>
    </div>
  );
};

export default SidebarLogo;
