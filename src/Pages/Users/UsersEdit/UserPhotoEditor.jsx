
import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody, Button, Row, Col, Input, Label, ButtonGroup } from "reactstrap";
import { Btn } from "../../../AbstractElements";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const UserPhotoEditor = ({ user, onClose, onSave }) => {
  const cropperRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState("");
  const [activeTab, setActiveTab] = useState("crop");
  const [texts, setTexts] = useState([]);
  const [icons, setIcons] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [textStyle, setTextStyle] = useState({
    fontSize: 24,
    fontFamily: "Arial",
    color: "#ffffff",
    fontWeight: "normal",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
  });

  const availableIcons = [
    { name: "heart", unicode: "❤️" },
    { name: "star", unicode: "⭐" },
    { name: "smile", unicode: "😊" },
    { name: "thumbs-up", unicode: "👍" },
    { name: "camera", unicode: "📷" },
    { name: "crown", unicode: "👑" },
    { name: "gem", unicode: "💎" },
    { name: "fire", unicode: "🔥" },
    { name: "check", unicode: "✅" },
    { name: "lightning", unicode: "⚡" }
  ];

  useEffect(() => {
    if (user?.UserFoto) {
      setImage(user.UserFoto);
    }
    drawCanvas();
  }, [user, texts, icons, cropData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setTexts([]);
        setIcons([]);
        setCropData("");
      };
      reader.readAsDataURL(file);
    }
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      setCropData(croppedCanvas.toDataURL());
    }
  };

  const drawCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    const baseImage = cropData || image;
    if (baseImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw texts
        texts.forEach(textObj => {
          ctx.font = `${textObj.fontWeight} ${textObj.fontSize}px ${textObj.fontFamily}`;
          ctx.fillStyle = textObj.color;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(textObj.text, textObj.x, textObj.y);
          ctx.shadowBlur = 0;
        });

        // Draw icons
        icons.forEach(iconObj => {
          ctx.font = `${iconObj.size}px Arial`;
          ctx.fillText(iconObj.unicode, iconObj.x, iconObj.y);
        });
      };
      img.src = baseImage;
    }
  };

  const addText = () => {
    if (currentText.trim()) {
      const newText = {
        id: Date.now(),
        text: currentText,
        x: 50,
        y: 100,
        ...textStyle
      };
      setTexts([...texts, newText]);
      setCurrentText("");
    }
  };

  const addIcon = (icon) => {
    const newIcon = {
      id: Date.now(),
      unicode: icon.unicode,
      name: icon.name,
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      size: 30
    };
    setIcons([...icons, newIcon]);
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const removeIcon = (id) => {
    setIcons(icons.filter(icon => icon.id !== id));
  };

  const updateTextPosition = (id, x, y) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, x, y } : text
    ));
  };

  const updateIconPosition = (id, x, y) => {
    setIcons(icons.map(icon => 
      icon.id === id ? { ...icon, x, y } : icon
    ));
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Move selected text/icon to clicked position
    if (texts.length > 0) {
      const lastText = texts[texts.length - 1];
      updateTextPosition(lastText.id, x, y);
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/jpeg', 0.9);
      onSave(dataURL);
    }
  };

  const resetAll = () => {
    setTexts([]);
    setIcons([]);
    setCropData("");
    setCurrentText("");
  };

  return (
    <Card className="h-100">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Editor de Foto</h5>
        <Button color="secondary" size="sm" onClick={onClose}>
          <i className="fa fa-times"></i>
        </Button>
      </CardHeader>
      <CardBody>
        <Row className="mb-3">
          <Col md="12">
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
              className="me-2"
            >
              <i className="fa fa-upload me-1"></i>
              Carregar Foto
            </Button>
            <Button 
              color="warning" 
              size="sm" 
              onClick={resetAll}
              className="me-2"
            >
              <i className="fa fa-refresh me-1"></i>
              Resetar
            </Button>
          </Col>
        </Row>

        {/* Tabs */}
        <Row className="mb-3">
          <Col md="12">
            <ButtonGroup size="sm" className="w-100">
              <Button 
                color={activeTab === "crop" ? "primary" : "outline-primary"}
                onClick={() => setActiveTab("crop")}
              >
                <i className="fa fa-crop me-1"></i>
                Recortar
              </Button>
              <Button 
                color={activeTab === "text" ? "primary" : "outline-primary"}
                onClick={() => setActiveTab("text")}
              >
                <i className="fa fa-font me-1"></i>
                Texto
              </Button>
              <Button 
                color={activeTab === "icons" ? "primary" : "outline-primary"}
                onClick={() => setActiveTab("icons")}
              >
                <i className="fa fa-smile-o me-1"></i>
                Ícones
              </Button>
              <Button 
                color={activeTab === "preview" ? "primary" : "outline-primary"}
                onClick={() => setActiveTab("preview")}
              >
                <i className="fa fa-eye me-1"></i>
                Preview
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        {/* Content based on active tab */}
        {activeTab === "crop" && image && (
          <Row>
            <Col md="12">
              <div style={{ maxHeight: "300px", overflow: "hidden" }}>
                <Cropper
                  ref={cropperRef}
                  style={{ height: 300, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={100}
                  minCropBoxWidth={100}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  guides={true}
                />
              </div>
              <Button color="primary" className="mt-2" onClick={getCropData}>
                <i className="fa fa-crop me-1"></i>
                Aplicar Recorte
              </Button>
            </Col>
          </Row>
        )}

        {activeTab === "text" && (
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label>Texto</Label>
                <Input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Digite o texto..."
                />
              </div>
              
              <Row>
                <Col md="6">
                  <Label>Tamanho</Label>
                  <Input
                    type="range"
                    min="12"
                    max="72"
                    value={textStyle.fontSize}
                    onChange={(e) => setTextStyle({...textStyle, fontSize: e.target.value})}
                  />
                  <small>{textStyle.fontSize}px</small>
                </Col>
                <Col md="6">
                  <Label>Cor</Label>
                  <Input
                    type="color"
                    value={textStyle.color}
                    onChange={(e) => setTextStyle({...textStyle, color: e.target.value})}
                  />
                </Col>
                <Col md="6">
                  <Label>Fonte</Label>
                  <Input
                    type="select"
                    value={textStyle.fontFamily}
                    onChange={(e) => setTextStyle({...textStyle, fontFamily: e.target.value})}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </Input>
                </Col>
                <Col md="6">
                  <Label>Peso</Label>
                  <Input
                    type="select"
                    value={textStyle.fontWeight}
                    onChange={(e) => setTextStyle({...textStyle, fontWeight: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Negrito</option>
                  </Input>
                </Col>
              </Row>

              <Button color="success" className="mt-3" onClick={addText} disabled={!currentText.trim()}>
                <i className="fa fa-plus me-1"></i>
                Adicionar Texto
              </Button>

              {/* Lista de textos */}
              {texts.length > 0 && (
                <div className="mt-3">
                  <Label>Textos Adicionados:</Label>
                  {texts.map(text => (
                    <div key={text.id} className="d-flex justify-content-between align-items-center mb-1 p-2 border rounded">
                      <small>{text.text}</small>
                      <Button size="sm" color="danger" onClick={() => removeText(text.id)}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        )}

        {activeTab === "icons" && (
          <Row>
            <Col md="12">
              <Label>Escolha um Ícone:</Label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {availableIcons.map(icon => (
                  <Button
                    key={icon.name}
                    size="sm"
                    color="outline-primary"
                    onClick={() => addIcon(icon)}
                    style={{ fontSize: "20px" }}
                  >
                    {icon.unicode}
                  </Button>
                ))}
              </div>

              {/* Lista de ícones */}
              {icons.length > 0 && (
                <div>
                  <Label>Ícones Adicionados:</Label>
                  {icons.map(icon => (
                    <div key={icon.id} className="d-flex justify-content-between align-items-center mb-1 p-2 border rounded">
                      <small>{icon.unicode} {icon.name}</small>
                      <Button size="sm" color="danger" onClick={() => removeIcon(icon.id)}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        )}

        {activeTab === "preview" && (
          <Row>
            <Col md="12" className="text-center">
              <Label>Preview Final (clique para posicionar textos/ícones):</Label>
              <div style={{ border: "1px solid #ddd", display: "inline-block" }}>
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    cursor: "crosshair"
                  }}
                />
              </div>
            </Col>
          </Row>
        )}

        {/* Botões de ação */}
        <Row className="mt-4">
          <Col md="12">
            <div className="d-flex gap-2 justify-content-end">
              <Button color="success" onClick={handleSave}>
                <i className="fa fa-save me-1"></i>
                Salvar Foto
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default UserPhotoEditor;
