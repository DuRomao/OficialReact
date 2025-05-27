
import React, { Fragment, useState, useContext } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from "reactstrap";
import { Breadcrumbs, Btn } from "../../../AbstractElements";
import UserEditForm from "./UserEditForm";
import UserPhotoEditor from "./UserPhotoEditor";
import CustomizerContext from "../../../_helper/Customizer";
import { useNavigate } from "react-router-dom";
import "./UserEdit.css";

const UsersEditContain = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);

  const handleNewUser = () => {
    setSelectedUser(null);
    setShowPhotoEditor(false);
  };

  const handleBackToList = () => {
    navigate(`${process.env.PUBLIC_URL}/app/users/cards/${layoutURL}`);
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Gerenciar Usuários" parent="Usuários" title="Editar" />
      <Container fluid={true}>
        <Row className="mb-3">
          <Col sm="12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Btn 
                  attrBtn={{ 
                    color: "secondary", 
                    size: "sm",
                    onClick: handleBackToList
                  }}
                >
                  <i className="fa fa-arrow-left me-1"></i>
                  Voltar para Lista
                </Btn>
              </div>
              <div>
                <Btn 
                  attrBtn={{ 
                    color: "success", 
                    onClick: handleNewUser
                  }}
                >
                  <i className="fa fa-plus me-1"></i>
                  Novo Usuário
                </Btn>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {selectedUser ? `Editar Usuário: ${selectedUser.UserNome}` : "Novo Usuário"}
                </h5>
                {selectedUser && (
                  <span className="badge badge-light-primary">
                    ID: {selectedUser.UserId}
                  </span>
                )}
              </CardHeader>
              <CardBody>
                {!showPhotoEditor ? (
                  <Row>
                    <Col xl="12">
                      <UserEditForm 
                        selectedUser={selectedUser} 
                        setSelectedUser={setSelectedUser}
                        onShowPhotoEditor={() => setShowPhotoEditor(true)}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col xl="8">
                      <UserEditForm 
                        selectedUser={selectedUser} 
                        setSelectedUser={setSelectedUser}
                        onShowPhotoEditor={() => setShowPhotoEditor(true)}
                      />
                    </Col>
                    <Col xl="4">
                      <UserPhotoEditor 
                        user={selectedUser}
                        onClose={() => setShowPhotoEditor(false)}
                        onSave={(photoData) => {
                          setSelectedUser({...selectedUser, UserFoto: photoData});
                          setShowPhotoEditor(false);
                        }}
                      />
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default UsersEditContain;
