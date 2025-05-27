
import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import axios from "axios";

const ExportOptions = ({ users }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const response = await axios.post('/api/users/export/pdf', 
        { users }, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const response = await axios.post('/api/users/export/excel', 
        { users }, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao exportar Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToTXT = () => {
    setExporting(true);
    try {
      const txtContent = users.map(user => 
        `${user.UserNome}\t${user.UserEmail}\t${user.UserTelefone || ''}\t${user.UserCelular || ''}\t${user.UserDataNascimento || ''}`
      ).join('\n');
      
      const headers = 'Nome\tE-mail\tTelefone\tCelular\tData Nascimento\n';
      const fullContent = headers + txtContent;
      
      const blob = new Blob([fullContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar TXT:', error);
      alert('Erro ao exportar TXT');
    } finally {
      setExporting(false);
    }
  };

  const exportAllUsers = async (format) => {
    setExporting(true);
    try {
      const response = await axios.get(`/api/users/export/${format}/all`, {
        responseType: 'blob'
      });
      
      const fileExtension = format === 'excel' ? 'xlsx' : format;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `todos_usuarios_${new Date().toISOString().split('T')[0]}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Erro ao exportar todos os usuários em ${format}:`, error);
      alert(`Erro ao exportar todos os usuários em ${format}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="success" size="sm" disabled={exporting}>
        <i className="fa fa-download me-1"></i>
        {exporting ? 'Exportando...' : 'Exportar'}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Usuários Atuais</DropdownItem>
        <DropdownItem onClick={exportToPDF}>
          <i className="fa fa-file-pdf me-2"></i>
          Exportar PDF
        </DropdownItem>
        <DropdownItem onClick={exportToExcel}>
          <i className="fa fa-file-excel me-2"></i>
          Exportar Excel
        </DropdownItem>
        <DropdownItem onClick={exportToTXT}>
          <i className="fa fa-file-text me-2"></i>
          Exportar TXT
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Todos os Usuários</DropdownItem>
        <DropdownItem onClick={() => exportAllUsers('pdf')}>
          <i className="fa fa-file-pdf me-2"></i>
          Todos em PDF
        </DropdownItem>
        <DropdownItem onClick={() => exportAllUsers('excel')}>
          <i className="fa fa-file-excel me-2"></i>
          Todos em Excel
        </DropdownItem>
        <DropdownItem onClick={() => exportAllUsers('txt')}>
          <i className="fa fa-file-text me-2"></i>
          Todos em TXT
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ExportOptions;
