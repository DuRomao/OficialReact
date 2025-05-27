import React, { Fragment, useState, useContext } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
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

  const handlePhotoSave = (photoData) => {
    setSelectedUser({...selectedUser, UserFoto: photoData});
    setShowPhotoEditor(false);
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Usuários" parent="Aplicações" title="Editar Usuário" />
      <Container fluid={true}>
        {/* Header Actions */}
        <Row className="mb-3">
          <Col sm="12">
            <div className="page-header-actions">
              <Button color="light" size="sm" onClick={handleBackToList} className="me-2">
                <i className="fa fa-arrow-left me-1"></i>
                Voltar
              </Button>
              <Button color="primary" onClick={handleNewUser}>
                <i className="fa fa-plus me-1"></i>
                Novo Usuário
              </Button>
            </div>
          </Col>
        </Row>

        {/* Main Form */}
        <Row>
          <Col sm="12">
            <Card className="cuba-card">
              <CardHeader className="cuba-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    {selectedUser ? `Editar: ${selectedUser.UserNome}` : "Novo Usuário"}
                  </h5>
                  {selectedUser && (
                    <span className="badge badge-light-primary cuba-badge">
                      ID: {selectedUser.UserId}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardBody className="cuba-body">
                <UserEditForm 
                  selectedUser={selectedUser} 
                  setSelectedUser={setSelectedUser}
                  onShowPhotoEditor={() => setShowPhotoEditor(true)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Photo Editor Modal */}
        <Modal 
          isOpen={showPhotoEditor} 
          toggle={() => setShowPhotoEditor(false)}
          size="lg"
          className="cuba-modal"
        >
          <ModalHeader toggle={() => setShowPhotoEditor(false)} className="cuba-modal-header">
            <h5 className="mb-0">Editor de Foto</h5>
          </ModalHeader>
          <ModalBody className="cuba-modal-body p-0">
            <UserPhotoEditor 
              user={selectedUser}
              onClose={() => setShowPhotoEditor(false)}
              onSave={handlePhotoSave}
            />
          </ModalBody>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default UsersEditContain;