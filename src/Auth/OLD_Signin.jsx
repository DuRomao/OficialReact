import React, { Fragment, useState, useEffect, useContext } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4, P } from "../AbstractElements";
import { 
  EmailAddress,
  ForgotPassword,
  Password,
  SignIn,
  API_URL,
} from "../Config/Constant";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import CustomizerContext from "../_helper/Customizer";
import {ToastContainer, toast } from "react-toastify";
import LogoutSistema from "./Logout";

// Configurar axios para incluir cookies
axios.defaults.withCredentials = true;

const Signin = ({ selected }) => {
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
    console.log("Aceitando cookies...");
    localStorage.setItem("cookieConsent", "accepted");
    setCookiesAccepted(true);
    window.location.reload();
  };


  // Função de login
  const loginAuth = async (e) => {
    e.preventDefault();

    if (!cookiesAccepted) {
      toast.error("Por favor, aceite os cookies antes de fazer login.");
      return;
    }

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
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
          localStorage.setItem("UserName", user.UserName||  "Usuário");
          localStorage.setItem("UserFoto", user.UserFoto || "Imagem");
          localStorage.setItem("Token", response.data.token);
          localStorage.setItem("Authenticated", "true");
          toast.success("Login realizado com sucesso!");
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
      };
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
          <P>Este site usa cookies para autenticação. Aceite os cookies para continuar.</P>
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
              console.log("Botão clicado");
              handleAcceptCookies();
            }}
          >
            Aceitar Cookies
          </button>
        </div>
      )}
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form" onSubmit={loginAuth}>
                  <H4>{selected === "simpleLogin" ? "" : "Login"}</H4>
                  <P>{"Informe o email e o password para login"}</P>
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
                    <Label className="col-form-label">{Password}</Label>
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
                  <div className="position-relative form-group mb-0">
                    <div className="checkbox">
                      <Input
                        id="checkbox1"
                        type="checkbox"
                        disabled={isLoading || !cookiesAccepted}
                      />
                      <Label className="text-muted" for="checkbox1">
                        {"Lembrar-me"}
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
                      {isLoading ? "Entrando..." : SignIn}
                    </Btn>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
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

export default Signin;
