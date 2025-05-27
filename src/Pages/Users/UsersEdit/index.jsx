
import React, { Fragment, useState, useContext } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import UserEditForm from "./UserEditForm";
import UserPhotoEditor from "./UserPhotoEditor";
import CustomizerContext from "../../../_helper/Customizer";

const UsersEditContain = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Editar Usuário" parent="Usuários" title="Editar" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <h5>Editar Usuário</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xl="8">
                    <UserEditForm 
                      selectedUser={selectedUser} 
                      setSelectedUser={setSelectedUser}
                      onShowPhotoEditor={() => setShowPhotoEditor(true)}
                    />
                  </Col>
                  <Col xl="4">
                    {showPhotoEditor && (
                      <UserPhotoEditor 
                        user={selectedUser}
                        onClose={() => setShowPhotoEditor(false)}
                        onSave={(photoData) => {
                          setSelectedUser({...selectedUser, UserFoto: photoData});
                          setShowPhotoEditor(false);
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default UsersEditContain;
