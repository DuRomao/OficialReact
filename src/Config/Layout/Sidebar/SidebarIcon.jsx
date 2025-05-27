import React, { useContext } from "react";
import { Link } from "react-router-dom";
import cubaimg from "../../../assets/img/logo/RGL1_FB.png";
import CustomizerContext from "../../../_helper/Customizer";

const SidebarIcon = () => {
  const { layoutURL } = useContext(CustomizerContext);
  return (
    <div className="logo-icon-wrapper">
      <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}>
        <img className="img-fluid" src={cubaimg} alt="" />
      </Link>
    </div>
  );
};

export default SidebarIcon;
