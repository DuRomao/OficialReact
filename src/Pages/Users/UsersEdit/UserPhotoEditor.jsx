import React, { useState, useRef, useEffect } from "react";
import { 
  Button, 
  Nav, 
  NavItem, 
  NavLink, 
  TabContent, 
  TabPane, 
  Input, 
  Label,
  Row,
  Col
} from "reactstrap";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const UserPhotoEditor = ({ user, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("crop");
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [icons, setIcons] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(16);
  const cropperRef = useRef(null);
  const canvasRef = useRef(null);

  const iconOptions = [
    "fa fa-star", "fa fa-heart", "fa fa-smile-o", "fa fa-thumbs-up",
    "fa fa-camera", "fa fa-phone", "fa fa-envelope", "fa fa-home",
    "fa fa-user", "fa fa-cog", "fa fa-bell", "fa fa-calendar"
  ];

  useEffect(() => {
    if (user?.UserFoto) {
      setImage(user.UserFoto);
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      setCroppedImage(canvas.toDataURL());
    }
  };

  const addText = () => {
    if (currentText.trim()) {
      const newText = {
        id: Date.now(),
        text: currentText,
        x: 50,
        y: 50,
        color: textColor,
        size: textSize
      };
      setTexts([...texts, newText]);
      setCurrentText("");
    }
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const addIcon = (iconClass) => {
    const newIcon = {
      id: Date.now(),
      icon: iconClass,
      x: 100,
      y: 100,
      size: 24,
      color: "#000000"
    };
    setIcons([...icons, newIcon]);
  };

  const removeIcon = (id) => {
    setIcons(icons.filter(icon => icon.id !== id));
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (croppedImage || image) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Draw texts
        texts.forEach(text => {
          ctx.font = `${text.size}px Arial`;
          ctx.fillStyle = text.color;
          ctx.fillText(text.text, text.x, text.y);
        });

        // Note: Icons would need a different approach in canvas
        // For simplicity, we'll skip icon rendering in canvas
      };
      img.src = croppedImage || image;
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [croppedImage, image, texts, icons]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    const finalImage = canvas.toDataURL();
    onSave(finalImage);
  };

  const resetEditor = () => {
    setImage(null);
    setCroppedImage(null);
    setTexts([]);
    setIcons([]);
    setCurrentText("");
  };

  return (
    <div className="bg-light">
      {/* Toolbar */}
      <div className="p-3 bg-white border-bottom d-flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button color="primary" size="sm">
            <i className="fa fa-upload me-1"></i>
            Carregar Imagem
          </Button>
        </label>

        <Button 
          color="secondary" 
          size="sm" 
          onClick={resetEditor}
        >
          <i className="fa fa-refresh me-1"></i>
          Limpar
        </Button>
      </div>

      {/* Tabs */}
      <div className="p-3 bg-white">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "crop" ? "active" : ""}
              onClick={() => setActiveTab("crop")}
            >
              <i className="fa fa-crop me-1"></i>
              Recortar
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "text" ? "active" : ""}
              onClick={() => setActiveTab("text")}
            >
              <i className="fa fa-font me-1"></i>
              Texto
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "icons" ? "active" : ""}
              onClick={() => setActiveTab("icons")}
            >
              <i className="fa fa-star me-1"></i>
              Ícones
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "preview" ? "active" : ""}
              onClick={() => setActiveTab("preview")}
            >
              <i className="fa fa-eye me-1"></i>
              Prévia
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Tab Content */}
      <div className="p-3" style={{ minHeight: "400px" }}>
        <TabContent activeTab={activeTab}>
          {/* Crop Tab */}
          <TabPane tabId="crop">
            <div className="text-center">
              {image && (
                <div className="border rounded overflow-hidden mb-3">
                  <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{ height: 300, width: "100%" }}
                    aspectRatio={1}
                    guides={false}
                    crop={handleCrop}
                  />
                </div>
              )}
              <div>
                <Button 
                  color="primary" 
                  onClick={handleCrop}
                  disabled={!image}
                >
                  <i className="fa fa-crop me-1"></i>
                  Aplicar Recorte
                </Button>
              </div>
            </div>
          </TabPane>

          {/* Text Tab */}
          <TabPane tabId="text">
            <Row>
              <Col md="6">
                <div className="card p-3">
                  <div className="mb-3">
                    <Label>Texto:</Label>
                    <Input
                      type="text"
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      placeholder="Digite o texto..."
                    />
                  </div>

                  <div className="mb-3">
                    <Label>Cor:</Label>
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <Label>Tamanho:</Label>
                    <Input
                      type="range"
                      min="12"
                      max="48"
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                    />
                    <span className="ms-2">{textSize}px</span>
                  </div>

                  <Button 
                    color="primary" 
                    onClick={addText}
                    disabled={!currentText.trim()}
                  >
                    <i className="fa fa-plus me-1"></i>
                    Adicionar Texto
                  </Button>
                </div>
              </Col>
              <Col md="6">
                <div className="card p-3">
                  <h6>Textos Adicionados:</h6>
                  {texts.map(text => (
                    <div key={text.id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border">
                      <span style={{ color: text.color, fontSize: `${text.size}px` }}>
                        {text.text}
                      </span>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => removeText(text.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </TabPane>

          {/* Icons Tab */}
          <TabPane tabId="icons">
            <div className="text-center">
              <h6>Escolha um ícone:</h6>
              <div className="d-flex flex-wrap gap-2 justify-content-center p-3 bg-light rounded border mb-3">
                {iconOptions.map((iconClass, index) => (
                  <Button
                    key={index}
                    color="outline-primary"
                    style={{ width: "50px", height: "50px" }}
                    onClick={() => addIcon(iconClass)}
                  >
                    <i className={iconClass}></i>
                  </Button>
                ))}
              </div>

              {icons.length > 0 && (
                <div className="card p-3">
                  <h6>Ícones Adicionados:</h6>
                  {icons.map(icon => (
                    <div key={icon.id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border">
                      <i className={icon.icon} style={{ fontSize: `${icon.size}px`, color: icon.color }}></i>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => removeIcon(icon.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabPane>

          {/* Preview Tab */}
          <TabPane tabId="preview">
            <div className="text-center">
              <h6>Prévia Final:</h6>
              <div className="d-inline-block border rounded overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  style={{ maxWidth: "100%", height: "auto", cursor: "crosshair" }}
                  onClick={(e) => {
                    // Handle click positioning for texts/icons
                    const rect = e.target.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    console.log('Click position:', x, y);
                  }}
                />
              </div>
            </div>
          </TabPane>
        </TabContent>
      </div>

      {/* Actions */}
      <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">
        <Button 
          color="light" 
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button 
          color="primary" 
          onClick={handleSave}
          disabled={!image}
        >
          <i className="fa fa-save me-1"></i>
          Salvar Foto
        </Button>
      </div>
    </div>
  );
};

export default UserPhotoEditor;