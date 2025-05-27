import React, { useState, useRef, useEffect } from "react";
import { Button, Row, Col, Input, Label, ButtonGroup } from "reactstrap";
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const baseImage = cropData || image;
    if (baseImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
    <div className="cuba-photo-editor">
      {/* Toolbar */}
      <div className="photo-editor-toolbar">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Button 
          color="primary" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          className="me-2"
        >
          <i className="fa fa-upload me-1"></i>
          Carregar
        </Button>
        <Button 
          color="secondary" 
          size="sm" 
          onClick={resetAll}
        >
          <i className="fa fa-refresh me-1"></i>
          Resetar
        </Button>
      </div>

      {/* Tabs */}
      <div className="photo-editor-tabs">
        <ButtonGroup size="sm" className="w-100">
          <Button 
            color={activeTab === "crop" ? "primary" : "outline-primary"}
            onClick={()={() => setActiveTab("crop")}}
          >
            <i className="fa fa-crop me-1"></i>
            Recortar
          </Button>
          <Button 
            color={activeTab === "text" ? "primary" : "outline-primary"}
            onClick={()={() => setActiveTab("text")}}
          >
            <i className="fa fa-font me-1"></i>
            Texto
          </Button>
          <Button 
            color={activeTab === "icons" ? "primary" : "outline-primary"}
            onClick={()={() => setActiveTab("icons")}}
          >
            <i className="fa fa-smile-o me-1"></i>
            Ícones
          </Button>
          <Button 
            color={activeTab === "preview" ? "primary" : "outline-primary"}
            onClick={()={() => setActiveTab("preview")}}
          >
            <i className="fa fa-eye me-1"></i>
            Preview
          </Button>
        </ButtonGroup>
      </div>

      {/* Content */}
      <div className="photo-editor-content">
        {activeTab === "crop" && image && (
          <div className="crop-section">
            <div className="cropper-container">
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
            <Button color="primary" className="mt-3" onClick={getCropData}>
              <i className="fa fa-crop me-1"></i>
              Aplicar Recorte
            </Button>
          </div>
        )}

        {activeTab === "text" && (
          <div className="text-section">
            <div className="text-controls">
              <Row>
                <Col md="12">
                  <Label>Texto</Label>
                  <Input
                    type="text"
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder="Digite o texto..."
                    className="mb-2"
                  />
                </Col>
                <Col md="6">
                  <Label>Tamanho: {textStyle.fontSize}px</Label>
                  <Input
                    type="range"
                    min="12"
                    max="72"
                    value={textStyle.fontSize}
                    onChange={(e) => setTextStyle({...textStyle, fontSize: e.target.value})}
                  />
                </Col>
                <Col md="6">
                  <Label>Cor</Label>
                  <Input
                    type="color"
                    value={textStyle.color}
                    onChange={(e) => setTextStyle({...textStyle, color: e.target.value})}
                  />
                </Col>
              </Row>
              <Button 
                color="success" 
                className="mt-3" 
                onClick={addText} 
                disabled={!currentText.trim()}
              >
                <i className="fa fa-plus me-1"></i>
                Adicionar Texto
              </Button>
            </div>

            {texts.length > 0 && (
              <div className="text-list mt-3">
                <Label>Textos Adicionados:</Label>
                {texts.map(text => (
                  <div key={text.id} className="text-item">
                    <span>{text.text}</span>
                    <Button size="sm" color="danger" onClick={() => removeText(text.id)}>
                      <i className="fa fa-trash"></i>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "icons" && (
          <div className="icons-section">
            <Label>Escolha um Ícone:</Label>
            <div className="icons-grid">
              {availableIcons.map(icon => (
                <Button
                  key={icon.name}
                  size="sm"
                  color="outline-primary"
                  onClick={() => addIcon(icon)}
                  className="icon-btn"
                >
                  {icon.unicode}
                </Button>
              ))}
            </div>

            {icons.length > 0 && (
              <div className="icons-list mt-3">
                <Label>Ícones Adicionados:</Label>
                {icons.map(icon => (
                  <div key={icon.id} className="icon-item">
                    <span>{icon.unicode} {icon.name}</span>
                    <Button size="sm" color="danger" onClick={() => removeIcon(icon.id)}>
                      <i className="fa fa-trash"></i>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && (
          <div className="preview-section">
            <Label>Preview Final (clique para posicionar):</Label>
            <div className="canvas-container">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="preview-canvas"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="photo-editor-actions">
        <Button color="light" onClick={onClose} className="me-2">
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSave}>
          <i className="fa fa-save me-1"></i>
          Salvar Foto
        </Button>
      </div>
    </div>
  );
};

export default UserPhotoEditor;