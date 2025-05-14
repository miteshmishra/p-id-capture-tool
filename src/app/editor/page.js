'use client';

import React, { useState, useRef } from 'react';
import Header from '../../components/Header/Header';
import SymbolLibrary from '../../components/SymbolLibrary/SymbolLibrary';
import KonvaCanvas from '../../components/KonvaCanvas/KonvaCanvas';
import Footer from '../../components/Footer/Footer';
import styles from './page.module.css';

export default function Editor() {
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [gridEnabled, setGridEnabled] = useState(true);
  const canvasRef = useRef(null);

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
    setSelectedComponent(null);
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    setSelectedTool('place-component');
  };

  const handleClear = () => {
    if (canvasRef.current && window.confirm('Are you sure you want to clear the canvas?')) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleSave = () => {
    alert('Project saved!');
  };

  const handleExport = (format = 'png') => {
    alert(`Exported as ${format}`);
  };

  const toggleGrid = () => {
    setGridEnabled((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / zoom);
    const y = Math.round((e.clientY - rect.top) / zoom);
    setCursorPosition({ x, y });
  };

  const handleStageClick = (e) => {
    if (selectedTool === 'place-component' && selectedComponent && canvasRef.current) {
      const stage = e.target.getStage();
      const position = stage.getPointerPosition();
      const scaledPosition = {
        x: position.x / zoom,
        y: position.y / zoom,
      };
      canvasRef.current.placeComponent(selectedComponent, scaledPosition);
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 3);
    setZoom(newZoom);
    if (canvasRef.current) canvasRef.current.setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
    if (canvasRef.current) canvasRef.current.setZoom(newZoom);
  };

  const handleZoomReset = () => {
    setZoom(1);
    if (canvasRef.current) canvasRef.current.setZoom(1);
  };

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
    if (canvasRef.current) canvasRef.current.setZoom(newZoom);
  };

  return (
    <div className={styles.editorContainer}>
      <Header 
        onNew={handleClear}
        onSave={handleSave}
        onExport={handleExport}
      />

      <div className={styles.editorContent}>
        <SymbolLibrary onSymbolSelect={handleComponentSelect} />

        <div 
          className={styles.canvasContainer} 
          onMouseMove={handleMouseMove}
        >
          <KonvaCanvas 
            ref={canvasRef}
            selectedTool={selectedTool}
            zoom={zoom}
            gridEnabled={gridEnabled}
            onZoomChange={handleZoomChange}
            onStageClick={handleStageClick}
          />
        </div>
      </div>

      <Footer 
        zoom={zoom}
        position={cursorPosition}
        gridEnabled={gridEnabled}
        onToggleGrid={toggleGrid}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />
    </div>
  );
}
