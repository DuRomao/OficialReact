
import React, { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from "reactstrap";
import { Btn, Image } from "../../../AbstractElements";
import axios from "axios";

const UserEditForm = ({ selectedUser, setSelectedUser, onShowPhotoEditor }) => {
  const [userTypes, setUserTypes] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();

  useEffect(() => {
    fetchUserTypes();
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      reset({
        UserNome: selectedUser.UserNome || "",
        UserEmail: selectedUser.UserEmail || "",
        UserTelefone: selectedUser.UserTelefone || "",
        UserCelular: selectedUser.UserCelular || "",
        UserDataNascimento: selectedUser.UserDataNascimento ? 
          new Date(selectedUser.UserDataNascimento).toISOString().split('T')[0] : "",
        UserBloq: selectedUser.UserBloq || 0,
        UserTipoUser: selectedUser.UserTipoUser || "",
        UserIdioma: selectedUser.UserIdioma || ""
      });
    }
  }, [selectedUser, reset]);

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get('/api/user-types');
      setUserTypes(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de usuário:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('/api/languages');
      setLanguages(response.data);
    } catch (error) {
      console.error('Erro ao buscar idiomas:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      if (selectedUser?.UserFoto) {
        formData.append('UserFoto', selectedUser.UserFoto);
      }

      const url = selectedUser?.UserId ? 
        `/api/users/${selectedUser.UserId}` : 
        '/api/users';
      
      const method = selectedUser?.UserId ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ 
        type: "success", 
        text: selectedUser?.UserId ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!" 
      });

      if (!selectedUser?.UserId) {
        reset();
        setSelectedUser(null);
      }

    } catch (error) {
      setMessage({ 
        type: "danger", 
        text: "Erro ao salvar usuário: " + (error.response?.data?.message || error.message)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {message.text && (
        <Alert color={message.type} className="mb-3">
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Seção da Foto */}
        <Row className="mb-4">
          <Col md="12">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">
                  <i className="fa fa-camera me-2"></i>
                  Foto do Usuário
                </h6>
              </div>
              <div className="card-body text-center py-4">
                {selectedUser?.UserFoto ? (
                  <Image
                    attrImage={{
                      className: "img-120 rounded-circle mb-3 shadow",
                      src: selectedUser.UserFoto,
                      alt: "Foto do usuário",
                      style: { width: "120px", height: "120px", objectFit: "cover" }
                    }}
                  />
                ) : (
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" 
                       style={{ width: "120px", height: "120px" }}>
                    <i className="fa fa-user fa-3x text-muted"></i>
                  </div>
                )}
                <br />
                <Button color="primary" type="button" onClick={onShowPhotoEditor} size="sm">
                  <i className="fa fa-edit me-2"></i>
                  {selectedUser?.UserFoto ? "Editar Foto" : "Adicionar Foto"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Seção de Informações Pessoais */}
        <Row className="mb-4">
          <Col md="12">
            <div className="card border-info">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="fa fa-user me-2"></i>
                  Informações Pessoais
                </h6>
              </div>
              <div className="card-body">
                <Row>

          <Col md="6">
                    <FormGroup>
                      <Label>Nome Completo *</Label>
                      <Input
                        type="text"
                        {...register("UserNome", { required: "Nome é obrigatório" })}
                        invalid={!!errors.UserNome}
                        className="form-control-lg"
                      />
                      {errors.UserNome && (
                        <div className="invalid-feedback">{errors.UserNome.message}</div>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>E-mail *</Label>
                      <Input
                        type="email"
                        {...register("UserEmail", { 
                          required: "E-mail é obrigatório",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "E-mail inválido"
                          }
                        })}
                        invalid={!!errors.UserEmail}
                        className="form-control-lg"
                      />
                      {errors.UserEmail && (
                        <div className="invalid-feedback">{errors.UserEmail.message}</div>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        {...register("UserDataNascimento")}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>Status</Label>
                      <Input
                        type="select"
                        {...register("UserBloq")}
                      >
                        <option value={0}>✅ Ativo</option>
                        <option value={1}>🚫 Bloqueado</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Seção de Contato */}
        <Row className="mb-4">
          <Col md="12">
            <div className="card border-success">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="fa fa-phone me-2"></i>
                  Informações de Contato
                </h6>
              </div>
              <div className="card-body">
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>
                        <i className="fa fa-phone me-1"></i>
                        Telefone
                      </Label>
                      <Input
                        type="text"
                        {...register("UserTelefone")}
                        placeholder="(11) 3333-4444"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>
                        <i className="fa fa-mobile me-1"></i>
                        Celular
                      </Label>
                      <Input
                        type="text"
                        {...register("UserCelular")}
                        placeholder="(11) 99999-8888"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Seção de Configurações */}
        <Row className="mb-4">
          <Col md="12">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">
                  <i className="fa fa-cogs me-2"></i>
                  Configurações do Sistema
                </h6>
              </div>
              <div className="card-body">
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Tipo de Usuário *</Label>
                      <Input
                        type="select"
                        {...register("UserTipoUser", { required: "Tipo de usuário é obrigatório" })}
                        invalid={!!errors.UserTipoUser}
                      >
                        <option value="">Selecione...</option>
                        {userTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.nome}
                          </option>
                        ))}
                      </Input>
                      {errors.UserTipoUser && (
                        <div className="invalid-feedback">{errors.UserTipoUser.message}</div>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>Idioma *</Label>
                      <Input
                        type="select"
                        {...register("UserIdioma", { required: "Idioma é obrigatório" })}
                        invalid={!!errors.UserIdioma}
                      >
                        <option value="">Selecione...</option>
                        {languages.map(lang => (
                          <option key={lang.id} value={lang.id}>
                            {lang.nome}
                          </option>
                        ))}
                      </Input>
                      {errors.UserIdioma && (
                        <div className="invalid-feedback">{errors.UserIdioma.message}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Botões de Ação */}
        <Row>
          <Col md="12">
            <div className="card">
              <div className="card-body text-center">
                <div className="d-flex gap-3 justify-content-center">
                  <Btn 
                    attrBtn={{ 
                      color: "secondary",
                      type: "button",
                      size: "lg"
                    }}
                    onClick={() => window.history.back()}
                  >
                    <i className="fa fa-times me-2"></i>
                    Cancelar
                  </Btn>
                  <Btn 
                    attrBtn={{ 
                      color: "success", 
                      type: "submit",
                      disabled: loading,
                      size: "lg"
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="fa fa-spinner fa-spin me-2"></i>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save me-2"></i>
                        {selectedUser ? "Atualizar Usuário" : "Criar Usuário"}
                      </>
                    )}
                  </Btn>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default UserEditForm;
