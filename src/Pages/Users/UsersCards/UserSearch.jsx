
import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Form, FormGroup, Label } from "reactstrap";
import axios from "axios";

const UserSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    nome: "",
    email: "",
    tipoUser: "",
    status: ""
  });
  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get('/api/user-types');
      setUserTypes(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de usuário:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleClear = () => {
    const clearedParams = {
      nome: "",
      email: "",
      tipoUser: "",
      status: ""
    };
    setSearchParams(clearedParams);
    onSearch(clearedParams);
  };

  return (
    <Form onSubmit={handleSearch} className="mt-3">
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={searchParams.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>E-mail</Label>
            <Input
              type="text"
              placeholder="Buscar por e-mail..."
              value={searchParams.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>Tipo</Label>
            <Input
              type="select"
              value={searchParams.tipoUser}
              onChange={(e) => handleInputChange('tipoUser', e.target.value)}
            >
              <option value="">Todos</option>
              {userTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.nome}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>Status</Label>
            <Input
              type="select"
              value={searchParams.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="0">Ativo</option>
              <option value="1">Bloqueado</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>&nbsp;</Label>
            <div className="d-flex gap-1">
              <Button color="primary" type="submit" size="sm">
                <i className="fa fa-search"></i>
              </Button>
              <Button color="secondary" type="button" onClick={handleClear} size="sm">
                <i className="fa fa-refresh"></i>
              </Button>
            </div>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default UserSearch;
