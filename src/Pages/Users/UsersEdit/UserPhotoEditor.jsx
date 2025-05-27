
import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody, Button, Row, Col, Input, Label } from "reactstrap";
import { Btn } from "../../../AbstractElements";

const UserPhotoEditor = ({ user, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0
  });
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [selectedIcon, setSelectedIcon] = useState("");

  const icons = [
    "fa-heart", "fa-star", "fa-smile", "fa-thumbs-up", 
    "fa-camera", "fa-crown", "fa-gem", "fa-fire"
  ];

  useEffect(() => {
    if (user?.UserFoto) {
      loadImageFromBase64(user.UserFoto);
    }
  }, [user]);

  const loadImageFromBase64 = (base64String) => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      drawImage(img);
    };
    img.src = base64String;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          drawImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = (img = image) => {
    if (!img || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((filters.rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur}px)
    `;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Restore context
    ctx.restore();

    // Add text if exists
    if (text) {
      ctx.font = "24px Arial";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(text, textPosition.x, textPosition.y);
      ctx.fillText(text, textPosition.x, textPosition.y);
    }

    // Add icon if selected
    if (selectedIcon) {
      ctx.font = "30px FontAwesome";
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeText("★", textPosition.x + 100, textPosition.y);
      ctx.fillText("★", textPosition.x + 100, textPosition.y);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  useEffect(() => {
    drawImage();
  }, [filters, text, textPosition, selectedIcon]);

  const handleSave = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/jpeg', 0.8);
      onSave(dataURL);
    }
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotation: 0
    });
    setText("");
    setSelectedIcon("");
  };

  return (
    <Card>
      <CardHeader>
        <h5>Editor de Foto</h5>
        <Button color="secondary" size="sm" onClick={onClose}>
          <i className="fa fa-times"></i>
        </Button>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="12" className="text-center mb-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Button 
              color="info" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fa fa-upload me-1"></i>
              Carregar Foto
            </Button>
          </Col>

          <Col md="12" className="text-center mb-3">
            <canvas
              ref={canvasRef}
              style={{
                border: "1px solid #ddd",
                maxWidth: "100%",
                height: "auto"
              }}
            />
          </Col>

          {/* Filtros */}
          <Col md="12">
            <h6>Ajustes</h6>
            <Row>
              <Col md="6">
                <Label>Brilho</Label>
                <Input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) => handleFilterChange('brightness', e.target.value)}
                />
                <small>{filters.brightness}%</small>
              </Col>
              <Col md="6">
                <Label>Contraste</Label>
                <Input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) => handleFilterChange('contrast', e.target.value)}
                />
                <small>{filters.contrast}%</small>
              </Col>
              <Col md="6">
                <Label>Saturação</Label>
                <Input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.saturation}
                  onChange={(e) => handleFilterChange('saturation', e.target.value)}
                />
                <small>{filters.saturation}%</small>
              </Col>
              <Col md="6">
                <Label>Desfoque</Label>
                <Input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.blur}
                  onChange={(e) => handleFilterChange('blur', e.target.value)}
                />
                <small>{filters.blur}px</small>
              </Col>
            </Row>
          </Col>

          {/* Rotação */}
          <Col md="12" className="mt-3">
            <h6>Rotação</h6>
            <div className="d-flex gap-2">
              <Button size="sm" onClick={() => handleFilterChange('rotation', filters.rotation - 90)}>
                <i className="fa fa-rotate-left"></i>
              </Button>
              <Button size="sm" onClick={() => handleFilterChange('rotation', filters.rotation + 90)}>
                <i className="fa fa-rotate-right"></i>
              </Button>
              <small className="align-self-center">{filters.rotation}°</small>
            </div>
          </Col>

          {/* Texto */}
          <Col md="12" className="mt-3">
            <h6>Adicionar Texto</h6>
            <Input
              type="text"
              placeholder="Digite o texto..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Col>

          {/* Ícones */}
          <Col md="12" className="mt-3">
            <h6>Ícones</h6>
            <div className="d-flex flex-wrap gap-2">
              {icons.map(icon => (
                <Button
                  key={icon}
                  size="sm"
                  color={selectedIcon === icon ? "primary" : "outline-primary"}
                  onClick={() => setSelectedIcon(selectedIcon === icon ? "" : icon)}
                >
                  <i className={`fa ${icon}`}></i>
                </Button>
              ))}
            </div>
          </Col>

          {/* Botões de ação */}
          <Col md="12" className="mt-4">
            <div className="d-flex gap-2 justify-content-end">
              <Button color="warning" size="sm" onClick={resetFilters}>
                <i className="fa fa-refresh me-1"></i>
                Resetar
              </Button>
              <Button color="success" onClick={handleSave}>
                <i className="fa fa-save me-1"></i>
                Salvar
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default UserPhotoEditor;
