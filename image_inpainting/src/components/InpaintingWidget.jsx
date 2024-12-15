import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';

const InpaintingWidget = () => {
  const fabricCanvasRef = useRef(null); // Ref to hold the canvas instance
  const canvasRef = useRef(null); // Ref to hold the actual DOM element for canvas
  const [brushSize, setBrushSize] = useState(10); // State for brush size

  // Initialize the fabric canvas when the component is mounted
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      fabricCanvasRef.current = fabricCanvas;
    }
  }, []);

  // Handle image upload and set it as background
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const fabricCanvas = fabricCanvasRef.current;
          if (fabricCanvas) {
            const fabricImage = new fabric.Image(img);
            fabricImage.set({
              left: 0,
              top: 0,
              scaleX: fabricCanvas.width / img.width,
              scaleY: fabricCanvas.height / img.height,
            });

            // Add the image to the canvas as a normal object (background image simulation)
            fabricCanvas.setBackgroundImage(fabricImage, fabricCanvas.renderAll.bind(fabricCanvas));
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle brush size change
  const handleBrushSizeChange = (e) => {
    const size = e.target.value;
    setBrushSize(size);
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      const brush = fabricCanvas.freeDrawingBrush;
      if (brush) {
        brush.width = parseInt(size, 10); // Set the brush width
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={canvasRef} width={500} height={500} />
      
      <div>
        <label>Brush Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
        <span>{brushSize}</span>
      </div>
    </div>
  );
};

export default InpaintingWidget;
