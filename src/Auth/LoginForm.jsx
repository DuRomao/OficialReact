import React, { Fragment, useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import { Btn, H4, P, Image } from "../AbstractElements";
import {
  EmailAddress,
  ForgotPassword,
  Password,
  SignIn,
  API_URL,
  CookieAceite,
  CookieText,
  RememberPassword, 
  Entrando,
  Login,LoginAviso,CookieErro,SubmitFormErro1,LoginOk
} from "../Config/Constant";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomizerContext from "../_helper/Customizer";
import { ToastContainer, toast } from "react-toastify";
import LogoutSistema from "./Logout";

import logoWhite from "../assets/img/logo/RGL_Control.png";
import logoDark from "../assets/img/logo/RGL_Control.png";

const LoginForm = ({ logoClassMain }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(
    localStorage.getItem("cookieConsent") === "accepted",
  );
  const navigate = useNavigate();
  const { layoutURL } = useContext(CustomizerContext);

  // Verificar autenticação após consentimento
  useEffect(() => {
    if (cookiesAccepted) {
    }
  }, [cookiesAccepted]);

  // Função para aceitar cookies
  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setCookiesAccepted(true);
    window.location.reload();
  };

  // Função de login
  const loginAuth = async (e) => {
    e.preventDefault();

    if (!cookiesAccepted) {
      toast.error(CookieErro);
      return;
    }

    if (!email || !password) {
      toast.error(SubmitFormErro1);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api.php?index=login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success && response.data.token) {
        const { user } = response.data;

        // Salvar informações do usuário
        if (user) {
          localStorage.setItem("UserName", user.UserName || "Usuário");
          localStorage.setItem("UserFoto", user.UserFoto || "Imagem");
          localStorage.setItem("Token", response.data.token);
          localStorage.setItem("Authenticated", "true");
          toast.success(LoginOk);
        }
        setTimeout(() => {
          navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`);
        }, 1000);
      } else {
        throw new Error(response.data.message || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro no login:", error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Erro ao fazer login.",
        );
      } else if (error.request) {
        toast.error("Erro de conexão com o servidor.");
      } else {
        toast.error("Erro inesperado: " + error.message);
      }
      LogoutSistema();
      navigate(`${process.env.PUBLIC_URL}/login`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {!cookiesAccepted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderBottom: "1px solid #ccc",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <P>
            {CookieText}
          </P>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleAcceptCookies();
            }}
          >
            {CookieAceite}
          </button>
        </div>
      )}
      <div className="login-card">
        <div>
          <div>
            <Link
              className={`logo ${logoClassMain ? logoClassMain : ""}`}
              to={process.env.PUBLIC_URL}
            >
              <Image
                attrImage={{
                  className: "img-fluid for-light",
                  src: logoWhite,
                  alt: "RGL Control",
                  style: {
                    height: "50px",
                    backgroundColor: "transparent"
                  }
                }}
              />
              <Image
                attrImage={{
                  className: "img-fluid for-dark",
                  src: logoDark,
                  alt: "RGL Control",
                  style: {
                    height: "50px",
                    backgroundColor: "transparent"
                  }
                }}
              />
            </Link>
          </div>

          <div className="login-main">
              <Form className="theme-form login-form" onSubmit={loginAuth}>
                <H4>{Login}</H4>
                <P>{LoginAviso}</P>
                <FormGroup>
                  <Label className="col-form-label">{EmailAddress}</Label>
                  <Input
                    className="form-control"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    disabled={isLoading || !cookiesAccepted}
                  />
                </FormGroup>
              <FormGroup className="position-relative">
                <Label className="col-form-label m-0">{Password}</Label>
                <div className="position-relative">
                  <Input
                    className="form-control"
                    type={togglePassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    disabled={isLoading || !cookiesAccepted}
                  />
                  <div
                    className="show-hide"
                    onClick={() => setTogglePassword(!togglePassword)}
                  >
                    <span className={togglePassword ? "" : "show"}></span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup className="position-relative">
                <div className="position-relative form-group mb-0">
                  <div className="checkbox">
                    <Input
                      id="checkbox1"
                      type="checkbox"
                      disabled={isLoading || !cookiesAccepted}
                    />
                    <Label className="text-muted" for="checkbox1">
                      {RememberPassword}
                    </Label>
                  </div>
                  <a className="link" href="#javascript">
                    {ForgotPassword}
                  </a>
                  <Btn
                    attrBtn={{
                      color: "primary",
                      className: "d-block w-100 mt-2",
                      type: "submit",
                      disabled: isLoading || !cookiesAccepted,
                    }}
                  >
                    {isLoading ? Entrando : SignIn}
                  </Btn>
                </div>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Fragment>
  );
};

export default LoginForm;
