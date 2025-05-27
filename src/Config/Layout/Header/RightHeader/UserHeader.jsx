import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogIn, Mail, User } from "react-feather";
import man from "../../../../assets/images/dashboard/profile.png";
import { LI, UL, Image, P } from "../../../../AbstractElements";
import CustomizerContext from "../../../../_helper/Customizer";
import { Account, Admin, Inbox, LogOut, Taskboard } from "../../../../Config/Constant";
import LogoutSistema from '../../../../Auth/Logout';



const UserHeader = () => {
  const navigate = useNavigate();
  const [UserFoto, setUserFoto] = useState("");
  const [UserName, setUserName] = useState("");
  const { layoutURL } = useContext(CustomizerContext);
  
  useEffect(() => {
    const UserFoto = localStorage.getItem("UserFoto") || man;
    const UserName = localStorage.getItem("UserName") || "";
    setUserFoto(UserFoto);
    setUserName(UserName);
  }, []);

  const handleLogout = () => {
      LogoutSistema();
      navigate(`${process.env.PUBLIC_URL}/login`);
  };

  const UserMenuRedirect = (redirect) => {
      navigate(redirect);
  };

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        <Image
          attrImage={{
            className: "b-r-10 m-0",
            src: `${UserFoto}`,
            alt: "",
            style: {
              width: "35px",
              height: "35px",
              borderRadius: "6px",
              objectFit: "cover",
              backgroundColor: "transparent"
            }
          }}
        />
        <div className="media-body">
          <span>{UserName}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {Admin} <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/users/profile/${layoutURL}`),
          }}>
          <User />
          <span>{Account} </span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/email-app/${layoutURL}`),
          }}>
          <Mail />
          <span>{Inbox}</span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/todo-app/todo/${layoutURL}`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI>
        <LI attrLI={{ onClick: handleLogout }}>
          <LogIn />
          <span>{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
