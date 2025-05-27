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
        <Alert color={message.type} className="cuba-alert">
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)} className="cuba-form">
        {/* Photo Section */}
        <div className="cuba-section photo-section">
          <div className="section-header">
            <i className="fa fa-camera"></i>
            <span>Foto do Usuário</span>
          </div>
          <div className="photo-container">
            <div className="photo-preview">
              {selectedUser?.UserFoto ? (
                <Image
                  attrImage={{
                    className: "cuba-avatar",
                    src: selectedUser.UserFoto,
                    alt: "Foto do usuário"
                  }}
                />
              ) : (
                <div className="cuba-avatar-placeholder">
                  <i className="fa fa-user"></i>
                </div>
              )}
            </div>
            <Button 
              color="primary" 
              type="button" 
              onClick={onShowPhotoEditor}
              className="cuba-btn"
            >
              <i className="fa fa-edit me-1"></i>
              {selectedUser?.UserFoto ? "Editar Foto" : "Adicionar Foto"}
            </Button>
          </div>
        </div>

        <Row>
          {/* Personal Information */}
          <Col lg="6">
            <div className="cuba-section">
              <div className="section-header">
                <i className="fa fa-user"></i>
                <span>Informações Pessoais</span>
              </div>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Nome Completo *</Label>
                <Input
                  type="text"
                  {...register("UserNome", { required: "Nome é obrigatório" })}
                  invalid={!!errors.UserNome}
                  className="cuba-input"
                />
                {errors.UserNome && (
                  <div className="invalid-feedback">{errors.UserNome.message}</div>
                )}
              </FormGroup>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">E-mail *</Label>
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
                  className="cuba-input"
                />
                {errors.UserEmail && (
                  <div className="invalid-feedback">{errors.UserEmail.message}</div>
                )}
              </FormGroup>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Data de Nascimento</Label>
                <Input
                  type="date"
                  {...register("UserDataNascimento")}
                  className="cuba-input"
                />
              </FormGroup>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Status</Label>
                <Input
                  type="select"
                  {...register("UserBloq")}
                  className="cuba-input"
                >
                  <option value={0}>✅ Ativo</option>
                  <option value={1}>🚫 Bloqueado</option>
                </Input>
              </FormGroup>
            </div>
          </Col>

          <Col lg="6">
            {/* Contact Information */}
            <div className="cuba-section">
              <div className="section-header">
                <i className="fa fa-phone"></i>
                <span>Contato</span>
              </div>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Telefone</Label>
                <Input
                  type="text"
                  {...register("UserTelefone")}
                  placeholder="(11) 3333-4444"
                  className="cuba-input"
                />
              </FormGroup>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Celular</Label>
                <Input
                  type="text"
                  {...register("UserCelular")}
                  placeholder="(11) 99999-8888"
                  className="cuba-input"
                />
              </FormGroup>
            </div>

            {/* System Settings */}
            <div className="cuba-section">
              <div className="section-header">
                <i className="fa fa-cogs"></i>
                <span>Configurações</span>
              </div>

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Tipo de Usuário *</Label>
                <Input
                  type="select"
                  {...register("UserTipoUser", { required: "Tipo de usuário é obrigatório" })}
                  invalid={!!errors.UserTipoUser}
                  className="cuba-input"
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

              <FormGroup className="cuba-field">
                <Label className="cuba-label">Idioma *</Label>
                <Input
                  type="select"
                  {...register("UserIdioma", { required: "Idioma é obrigatório" })}
                  invalid={!!errors.UserIdioma}
                  className="cuba-input"
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
            </div>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="cuba-actions">
          <Button 
            color="light" 
            type="button" 
            onClick={() => window.history.back()}
            className="cuba-btn-secondary"
          >
            Cancelar
          </Button>
          <Button 
            color="primary" 
            type="submit"
            disabled={loading}
            className="cuba-btn"
          >
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin me-1"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fa fa-save me-1"></i>
                {selectedUser ? "Atualizar" : "Criar"} Usuário
              </>
            )}
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default UserEditForm;