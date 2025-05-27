
import React, { Fragment, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, Button, Badge, Spinner } from "reactstrap";
import { Image } from "../../../AbstractElements";

const UsersCardView = ({ users, loading, hasMore, onLoadMore, onEdit, onDelete }) => {
  const observerRef = useRef();
  const lastUserElementRef = useRef();

  useEffect(() => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (lastUserElementRef.current) {
      observerRef.current.observe(lastUserElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading, hasMore, onLoadMore]);

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    return status === 0 ? (
      <Badge color="success">Ativo</Badge>
    ) : (
      <Badge color="danger">Bloqueado</Badge>
    );
  };

  return (
    <Fragment>
      <Row>
        {users.map((user, index) => (
          <Col
            key={user.UserId}
            xl="4"
            sm="6"
            xxl="3"
            className="col-ed-4 box-col-4"
            ref={index === users.length - 1 ? lastUserElementRef : null}
          >
            <Card className="social-profile">
              <CardBody>
                <div className="social-img-wrap">
                  <div className="social-img">
                    {user.UserFoto ? (
                      <Image
                        attrImage={{
                          src: user.UserFoto,
                          alt: user.UserNome,
                          className: "img-fluid rounded-circle"
                        }}
                      />
                    ) : (
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: "70px", height: "70px" }}>
                        <i className="fa fa-user fa-2x text-muted"></i>
                      </div>
                    )}
                  </div>
                  <div className="edit-icon">
                    {getStatusBadge(user.UserBloq)}
                  </div>
                </div>
                
                <div className="social-details">
                  <h5 className="mb-1">
                    <a href="#" onClick={(e) => { e.preventDefault(); onEdit(user.UserId); }}>
                      {user.UserNome}
                    </a>
                  </h5>
                  <span className="f-light">{user.UserEmail}</span>
                  
                  <div className="mt-2">
                    {user.UserTelefone && (
                      <p className="mb-1">
                        <i className="fa fa-phone me-2"></i>
                        {user.UserTelefone}
                      </p>
                    )}
                    {user.UserCelular && (
                      <p className="mb-1">
                        <i className="fa fa-mobile me-2"></i>
                        {user.UserCelular}
                      </p>
                    )}
                    <p className="mb-1">
                      <i className="fa fa-calendar me-2"></i>
                      {formatDate(user.UserDataNascimento)}
                    </p>
                  </div>

                  <div className="social-follow mt-3">
                    <div className="d-flex justify-content-between">
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => onEdit(user.UserId)}
                      >
                        <i className="fa fa-edit me-1"></i>
                        Editar
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => onDelete(user.UserId)}
                      >
                        <i className="fa fa-trash me-1"></i>
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {loading && (
        <div className="text-center py-4">
          <Spinner color="primary" />
          <p className="mt-2">Carregando usuários...</p>
        </div>
      )}

      {!loading && !hasMore && users.length > 0 && (
        <div className="text-center py-4">
          <p className="text-muted">Todos os usuários foram carregados.</p>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">Nenhum usuário encontrado.</p>
        </div>
      )}
    </Fragment>
  );
};

export default UsersCardView;
