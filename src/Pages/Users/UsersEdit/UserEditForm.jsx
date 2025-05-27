
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
        <Row>
          <Col md="12" className="mb-3">
            <div className="text-center">
              {selectedUser?.UserFoto ? (
                <Image
                  attrImage={{
                    className: "img-100 rounded-circle mb-3",
                    src: selectedUser.UserFoto,
                    alt: "Foto do usuário"
                  }}
                />
              ) : (
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: "100px", height: "100px" }}>
                  <i className="fa fa-user fa-2x text-muted"></i>
                </div>
              )}
              <br />
              <Button color="primary" type="button" onClick={onShowPhotoEditor}>
                <i className="fa fa-camera me-2"></i>
                Editar Foto
              </Button>
            </div>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label>Nome Completo *</Label>
              <Input
                type="text"
                {...register("UserNome", { required: "Nome é obrigatório" })}
                invalid={!!errors.UserNome}
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
              />
              {errors.UserEmail && (
                <div className="invalid-feedback">{errors.UserEmail.message}</div>
              )}
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label>Telefone</Label>
              <Input
                type="text"
                {...register("UserTelefone")}
                placeholder="(11) 3333-4444"
              />
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label>Celular</Label>
              <Input
                type="text"
                {...register("UserCelular")}
                placeholder="(11) 99999-8888"
              />
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

          <Col md="6">
            <FormGroup>
              <Label>Status</Label>
              <Input
                type="select"
                {...register("UserBloq")}
              >
                <option value={0}>Ativo</option>
                <option value={1}>Bloqueado</option>
              </Input>
            </FormGroup>
          </Col>

          <Col md="12">
            <div className="text-end">
              <Btn 
                attrBtn={{ 
                  color: "primary", 
                  type: "submit",
                  disabled: loading
                }}
              >
                {loading ? "Salvando..." : "Salvar Usuário"}
              </Btn>
            </div>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default UserEditForm;
