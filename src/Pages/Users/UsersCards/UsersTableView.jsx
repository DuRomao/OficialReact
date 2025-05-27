
import React, { Fragment, useState, useEffect } from "react";
import { Table, Button, Badge, Pagination, PaginationItem, PaginationLink, Input, Form, FormGroup } from "reactstrap";
import { Image } from "../../../AbstractElements";

const UsersTableView = ({ users, loading, hasMore, onLoadMore, onEdit, onDelete }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

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

  const handleInlineEdit = (user) => {
    setEditingUser(user.UserId);
    setEditData({
      UserNome: user.UserNome,
      UserEmail: user.UserEmail,
      UserTelefone: user.UserTelefone || "",
      UserCelular: user.UserCelular || ""
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      // Aqui você faria a chamada para a API para salvar as alterações
      console.log('Salvando alterações para o usuário:', userId, editData);
      setEditingUser(null);
      setEditData({});
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  return (
    <Fragment>
      <div className="table-responsive">
        <Table striped>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Celular</th>
              <th>Data Nascimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.UserId}>
                <td>
                  {user.UserFoto ? (
                    <Image
                      attrImage={{
                        src: user.UserFoto,
                        alt: user.UserNome,
                        className: "img-40 rounded-circle"
                      }}
                    />
                  ) : (
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: "40px", height: "40px" }}>
                      <i className="fa fa-user text-muted"></i>
                    </div>
                  )}
                </td>
                <td>
                  {editingUser === user.UserId ? (
                    <Input
                      type="text"
                      value={editData.UserNome}
                      onChange={(e) => setEditData({...editData, UserNome: e.target.value})}
                      size="sm"
                    />
                  ) : (
                    user.UserNome
                  )}
                </td>
                <td>
                  {editingUser === user.UserId ? (
                    <Input
                      type="email"
                      value={editData.UserEmail}
                      onChange={(e) => setEditData({...editData, UserEmail: e.target.value})}
                      size="sm"
                    />
                  ) : (
                    user.UserEmail
                  )}
                </td>
                <td>
                  {editingUser === user.UserId ? (
                    <Input
                      type="text"
                      value={editData.UserTelefone}
                      onChange={(e) => setEditData({...editData, UserTelefone: e.target.value})}
                      size="sm"
                    />
                  ) : (
                    user.UserTelefone || "-"
                  )}
                </td>
                <td>
                  {editingUser === user.UserId ? (
                    <Input
                      type="text"
                      value={editData.UserCelular}
                      onChange={(e) => setEditData({...editData, UserCelular: e.target.value})}
                      size="sm"
                    />
                  ) : (
                    user.UserCelular || "-"
                  )}
                </td>
                <td>{formatDate(user.UserDataNascimento)}</td>
                <td>{getStatusBadge(user.UserBloq)}</td>
                <td>
                  <div className="d-flex gap-1">
                    {editingUser === user.UserId ? (
                      <>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => handleSaveEdit(user.UserId)}
                        >
                          <i className="fa fa-check"></i>
                        </Button>
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <i className="fa fa-times"></i>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleInlineEdit(user)}
                          title="Edição rápida"
                        >
                          <i className="fa fa-edit"></i>
                        </Button>
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => onEdit(user.UserId)}
                          title="Edição completa"
                        >
                          <i className="fa fa-external-link"></i>
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => onDelete(user.UserId)}
                          title="Excluir"
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {loading && (
        <div className="text-center py-3">
          <p>Carregando mais usuários...</p>
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center py-3">
          <Button color="primary" onClick={onLoadMore}>
            Carregar mais usuários
          </Button>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <div className="text-center py-3">
          <p className="text-muted">Todos os usuários foram carregados.</p>
        </div>
      )}
    </Fragment>
  );
};

export default UsersTableView;
