
import React, { Fragment, useState, useEffect, useContext } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4, P } from "../AbstractElements";
import {
  EmailAddress,
  ForgotPassword,
  Password,
  SignIn,
  API_URL,
} from "../Constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import man from "../assets/images/dashboard/profile.png";
import CustomizerContext from "../_helper/Customizer";
import { ToastContainer, toast } from "react-toastify";

// Configurar axios para incluir cookies
axios.defaults.withCredentials = true;

const Signin = ({ selected }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { layoutURL } = useContext(CustomizerContext);

  // Estado para armazenar informações do usuário
  const [value, setValue] = useState(localStorage.getItem("profileURL") || man);
  const [name, setName] = useState(localStorage.getItem("Name") || "");

  // Verificar se já está autenticado
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const authenticated = localStorage.getItem("authenticated");
    
    if (token && authenticated === "true") {
      // Se já está logado, redirecionar para dashboard
      navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`);
    }

    // Configurar valores padrão
    if (!localStorage.getItem("profileURL")) {
      localStorage.setItem("profileURL", man);
    }
    if (!localStorage.getItem("Name")) {
      localStorage.setItem("Name", "Emay Walter");
    }
  }, [navigate, layoutURL]);

  // Função de login
  const loginAuth = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Enviar credenciais ao endpoint /login
      const response = await axios.post(
        `${API_URL}/api.php?index=login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.token) {
        const { user, token } = response.data;

        // Salvar token JWT
        localStorage.setItem("authToken", token);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("login", "true");

        // Atualizar estado com informações do usuário
        if (user) {
          setName(user.name || "Usuário");
          setValue(user.profileURL || man);
          localStorage.setItem("Name", user.name || "Usuário");
          localStorage.setItem("profileURL", user.profileURL || man);
        }

        // Configurar axios para usar o token em requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Exibir mensagem de sucesso
        toast.success("Login realizado com sucesso!");
        
        // Aguardar um momento antes de redirecionar
        setTimeout(() => {
          navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`);
        }, 1000);
        
      } else {
        throw new Error(response.data.message || "Credenciais inválidas");
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Limpar dados de autenticação em caso de erro
      localStorage.removeItem("authToken");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("login");
      
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error || 'Erro ao fazer login.';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Erro de conexão com o servidor.');
      } else {
        toast.error('Erro inesperado: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
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
                      disabled={isLoading}
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
                        disabled={isLoading}
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
                      <Input id="checkbox1" type="checkbox" disabled={isLoading} />
                      <Label className="text-muted" for="checkbox1">{"Lembrar-me"}</Label>
                    </div>
                    <a className="link" href="#javascript">
                      {ForgotPassword}
                    </a>
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-2",
                        type: "submit",
                        disabled: isLoading
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
