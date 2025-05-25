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
  const navigate = useNavigate(); // Alterado de history para navigate (React Router v6)
  const { layoutURL } = useContext(CustomizerContext);

  // Estado para armazenar informações do usuário (opcional, para exibir nome/imagem)
  const [value, setValue] = useState(localStorage.getItem("profileURL") || man);
  const [name, setName] = useState(localStorage.getItem("Name") || "");

  // Configurar imagem e nome padrão no localStorage
  useEffect(() => {
    localStorage.setItem("profileURL", man);
    localStorage.setItem("Name", "Emay Walter");
  }, [value, name]);

  // Função de login
  const loginAuth = async (e) => {
    e.preventDefault();
    try {
      // Enviar credenciais ao endpoint /login
      const response = await axios.post(
        `${API_URL}/api.php?index=login`,
        { email, password },
        { withCredentials: true }, // Necessário para enviar/receber cookies
      );

       const { user } = response.data;

      // Atualizar estado com informações do usuário
      setName(user.name);
      setValue(user.profileURL || man);
      localStorage.setItem("Name", user.name);
      localStorage.setItem("profileURL", user.profileURL || man);
      localStorage.setItem("login", JSON.stringify(true)); // Manter compatibilidade com o código original

      // Exibir mensagem de sucesso
      toast.success("Sucesso, usuário logado!");
    
      navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`);
    } catch (error) {
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data);
        toast.error(error.response.data.error || 'Erro ao fazer login.');
      } else if (error.request) {
        console.error('Nenhuma resposta recebida:', error.request);
        toast.error('Erro de conexão com o servidor.');
      } else {
        console.error('Erro na configuração:', error.message);
        toast.error('Erro inesperado: ' + error.message);
      }
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form">
                  <H4>{selected === "simpleLogin" ? "" : "Login"}</H4>
                  <P>{"Informe o email e o password para login"}</P>
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input
                      className="form-control"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
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
                      <Input id="checkbox1" type="checkbox" />
                    </div>
                    <a className="link" href="#javascript">
                      {ForgotPassword}
                    </a>
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-2",
                        onClick: (e) => loginAuth(e),
                      }}
                    >
                      {SignIn}
                    </Btn>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default Signin;
