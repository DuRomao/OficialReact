
import React, { Fragment, useState, useContext, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Button, ButtonGroup } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import UsersCardView from "./UsersCardView";
import UsersTableView from "./UsersTableView";
import UserSearch from "./UserSearch";
import ExportOptions from "./ExportOptions";
import CustomizerContext from "../../../_helper/Customizer";
import axios from "axios";

const UsersCardsContain = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useState({
    nome: "",
    email: "",
    tipoUser: "",
    status: ""
  });

  useEffect(() => {
    loadUsers(1, true);
  }, [searchParams]);

  const loadUsers = async (pageNum = page, reset = false) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        ...searchParams
      };

      const response = await axios.get('/api/users', { params });
      const newUsers = response.data.users || [];

      if (reset) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }

      setHasMore(newUsers.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadUsers(page + 1);
    }
  };

  const handleEditUser = (userId) => {
    window.location.href = `${process.env.PUBLIC_URL}/app/users/edit/${layoutURL}?id=${userId}`;
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(prev => prev.filter(user => user.UserId !== userId));
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário');
      }
    }
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Usuários" parent="Aplicações" title="Lista de Usuários" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Gerenciar Usuários</h5>
                  <div className="d-flex gap-2">
                    <ExportOptions users={users} />
                    <ButtonGroup>
                      <Button
                        color={viewMode === 'cards' ? 'primary' : 'outline-primary'}
                        onClick={() => setViewMode('cards')}
                        size="sm"
                      >
                        <i className="fa fa-th"></i> Cards
                      </Button>
                      <Button
                        color={viewMode === 'table' ? 'primary' : 'outline-primary'}
                        onClick={() => setViewMode('table')}
                        size="sm"
                      >
                        <i className="fa fa-table"></i> Tabela
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
                <UserSearch onSearch={handleSearch} />
              </CardHeader>
              <CardBody>
                {viewMode === 'cards' ? (
                  <UsersCardView
                    users={users}
                    loading={loading}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ) : (
                  <UsersTableView
                    users={users}
                    loading={loading}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default UsersCardsContain;
