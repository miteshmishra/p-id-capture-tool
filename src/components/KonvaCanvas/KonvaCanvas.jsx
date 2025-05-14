'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import styles from './KonvaCanvas.module.css';
import SvgSymbol from '../SvgSymbol/SvgSymbol';
import ContextMenu from '../ContextMenu/ContextMenu';

const KonvaCanvas = forwardRef(({ selectedTool, zoom = 1, gridEnabled = true, onZoomChange }, ref) => {
  const [components, setComponents] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 1000, height: 600 });
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const [connectionMode, setConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionType, setConnectionType] = useState({
    strokeWidth: 2,
    stroke: 'black',
    lineDash: []
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isClient]);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('application/pid-component');
    if (componentData) {
      const component = JSON.parse(componentData);
      const stageBox = stageRef.current.container().getBoundingClientRect();
      const stage = stageRef.current;
      
      const currentScale = stage.scaleX();
      const stagePos = stage.position();
      
      const position = {
        x: (e.clientX - stageBox.left - stagePos.x) / currentScale,
        y: (e.clientY - stageBox.top - stagePos.y) / currentScale
      };

      const snappedPosition = {
        x: Math.round(position.x / 20) * 20,
        y: Math.round(position.y / 20) * 20
      };

      const newComponent = {
        ...component,
        id: `${component.id}-${Date.now()}`,
        x: snappedPosition.x,
        y: snappedPosition.y
      };

      setComponents([...components, newComponent]);
    }
  };

  
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.max(0.1, newScale); // Only limit minimum zoom, no maximum limit

    stage.scale({ x: limitedScale, y: limitedScale });

    const newPos = {
      x: pointerPosition.x - mousePointTo.x * limitedScale,
      y: pointerPosition.y - mousePointTo.y * limitedScale,
    };

    stage.position(newPos);
    stage.batchDraw();

    if (onZoomChange) {
      onZoomChange(limitedScale);
    }
    
    if (limitedScale > 5) {
      stage.batchDraw();
    }
  };
  // const handleWheel = (e) => {
  //   e.evt.preventDefault();

  //   const scaleBy = 1.1;
  //   const stage = stageRef.current;
  //   const oldScale = stage.scaleX();
  //   const pointerPosition = stage.getPointerPosition();
  //   const mousePointTo = {
  //     x: (pointerPosition.x - stage.x()) / oldScale,
  //     y: (pointerPosition.y - stage.y()) / oldScale,
  //   };

  //   const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
  //   const limitedScale = Math.max(0.5, Math.min(newScale, 3));

  //   stage.scale({ x: limitedScale, y: limitedScale });

  //   const newPos = {
  //     x: pointerPosition.x - mousePointTo.x * limitedScale,
  //     y: pointerPosition.y - mousePointTo.y * limitedScale,
  //   };

  //   stage.position(newPos);
  //   stage.batchDraw();

  //   if (onZoomChange) {
  //     onZoomChange(limitedScale);
  //   }
  // };

  const placeComponent = (component, position) => {
    // If we have a stage reference, adjust for current zoom and position
    let adjustedPosition = position;
    if (stageRef.current) {
      const currentScale = stageRef.current.scaleX();
      const stagePos = stageRef.current.position();
      
      // Only adjust if the position is in screen coordinates
      if (component.useScreenCoordinates) {
        const stageBox = stageRef.current.container().getBoundingClientRect();
        adjustedPosition = {
          x: (position.x - stageBox.left - stagePos.x) / currentScale,
          y: (position.y - stageBox.top - stagePos.y) / currentScale
        };
      }
    }
    
    const snappedPosition = gridEnabled ? {
      x: Math.round(adjustedPosition.x / 20) * 20,
      y: Math.round(adjustedPosition.y / 20) * 20
    } : adjustedPosition;

    const newComponent = {
      ...component,
      id: `${component.id}-${Date.now()}`,
      x: snappedPosition.x,
      y: snappedPosition.y
    };

    setComponents([...components, newComponent]);
  };

  const handleComponentClick = (id) => {
    // Close context menu if it's open
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }
    
    // If in connection mode, handle connection logic
    if (connectionMode) {
      const clickedComponent = components.find(comp => comp.id === id);
      
      if (!connectionStart) {
        setConnectionStart({
          id: id,
          x: clickedComponent.x,
          y: clickedComponent.y
        });
      } else if (connectionStart.id !== id) {
        const endComponent = clickedComponent;
        
        const newConnector = {
          id: `connector-${Date.now()}`,
          type: 'connector',
          points: [
            connectionStart.x, connectionStart.y,
            endComponent.x, endComponent.y
          ],
          strokeWidth: connectionType.strokeWidth,
          stroke: connectionType.stroke,
          lineDash: connectionType.lineDash
        };
        
        setConnectors([...connectors, newConnector]);
        setConnectionStart(null); 
      }
    } else {
      // Normal selection behavior when not in connection mode
      setSelectedId(id === selectedId ? null : id);
    }
  };
  
  const handleContextMenu = (e, id) => {
    e.evt.preventDefault(); // Prevent browser context menu
    
    // Set selected component
    setSelectedId(id);
    
    // Get component position
    const component = components.find(comp => comp.id === id);
    if (!component) return;
    
    // Get stage info
    const stage = stageRef.current;
    const scale = stage.scaleX();
    const stagePos = stage.position();
    
    // Calculate absolute position
    const x = component.x * scale + stagePos.x + 40; // Position to the right of component
    const y = component.y * scale + stagePos.y;
    
    setContextMenu({
      visible: true,
      x: x,
      y: y
    });
  };
  
  const handleRotate = (degrees) => {
    setComponents(components.map(comp => {
      if (comp.id === selectedId) {
        return {
          ...comp,
          rotation: degrees
        };
      }
      return comp;
    }));
  };
  
  const handleColorChange = (color) => {
    setComponents(components.map(comp => {
      if (comp.id === selectedId) {
        return {
          ...comp,
          strokeColor: color // Using strokeColor instead of color
        };
      }
      return comp;
    }));
  };
  
  // Close context menu and unselect object when clicking on stage
  const handleStageClick = (e) => {
    // Check if we clicked on the background layer
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background';
    
    // Close context menu regardless of where clicked
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
    
    // Unselect the object if clicking on empty space
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleDragEnd = (e, id) => {
    const updatedComponents = components.map(comp => {
      if (comp.id === id) {
        // Get position from event target
        let newX, newY;
        
        // Handle both Konva.Node and custom events from SvgSymbol
        if (e.target && typeof e.target.x === 'function') {
          newX = e.target.x();
          newY = e.target.y();
        } else if (e.currentTarget) {
          // For SVG symbols that might pass different event structure
          newX = e.currentTarget.x();
          newY = e.currentTarget.y();
        } else {
          // Direct position values (might be passed from SvgSymbol)
          newX = e.x !== undefined ? e.x : comp.x;
          newY = e.y !== undefined ? e.y : comp.y;
        }
        
        if (gridEnabled) {
          return {
            ...comp,
            x: Math.round(newX / 20) * 20,
            y: Math.round(newY / 20) * 20
          };
        } else {
          return {
            ...comp,
            x: newX,
            y: newY
          };
        }
      }
      return comp;
    });

    setComponents(updatedComponents);
  };

  const clearCanvas = () => {
    setComponents([]);
    setSelectedId(null);
  };

  useImperativeHandle(ref, () => ({
    clearCanvas,
    placeComponent
  }));

  const renderComponent = (component) => {
    const isSelected = component.id === selectedId;
    const componentId = component.id;

    const commonProps = {
      onClick: () => handleComponentClick(componentId),
      onTap: () => handleComponentClick(componentId),
      draggable: true,
      onDragEnd: (e) => handleDragEnd(e, componentId),
      stroke: isSelected ? 'blue' : 'black',
      strokeWidth: isSelected ? 2 : 1,
      x: component.x,
      y: component.y,
      onContextMenu: (e) => handleContextMenu(e, componentId)
    };

    // Handle SVG components
    if (component.type === 'svg-component') {
      return (
        <SvgSymbol
          key={componentId}
          svgPath={component.svgPath}
          x={component.x}
          y={component.y}
          width={component.width || 40}
          height={component.height || 40}
          draggable={true}
          onClick={() => handleComponentClick(componentId)}
          onDragEnd={(e) => handleDragEnd(e, componentId)}
          isSelected={isSelected}
          rotation={component.rotation || 0}
          color={component.strokeColor || 'black'}
          onContextMenu={(e) => handleContextMenu(e, componentId)}
        />
      );
    }

    // Handle regular components
    switch (component.id.split('-')[0]) {
      case 'valve-gate':
        return (
          <Group key={componentId} {...commonProps}>
            <Line points={[0, -20, 0, 20]} stroke="black" strokeWidth={2} />
            <Rect width={20} height={20} x={-10} y={-10} fill="white" stroke="black" />
          </Group>
        );
      case 'valve-globe':
        return (
          <Group key={componentId} {...commonProps}>
            <Line points={[0, -20, 0, 20]} stroke="black" strokeWidth={2} />
            <Circle radius={10} fill="white" stroke="black" />
          </Group>
        );
      case 'valve-check':
        return (
          <Group key={componentId} {...commonProps}>
            <Line points={[0, -20, 0, 20]} stroke="black" strokeWidth={2} />
            <Circle radius={10} fill="white" stroke="black" />
            <Line points={[-5, 0, 5, 0]} stroke="black" strokeWidth={2} />
            <Line points={[0, -5, 0, 5]} stroke="black" strokeWidth={2} />
          </Group>
        );
      case 'pump-centrifugal':
        return (
          <Group key={componentId} {...commonProps}>
            <Circle radius={15} fill="white" stroke="black" />
            <Line points={[-15, 0, 15, 0]} stroke="black" strokeWidth={2} />
          </Group>
        );
      case 'vessel-vertical':
        return (
          <Group key={componentId} {...commonProps}>
            <Rect width={40} height={60} x={-20} y={-30} fill="white" stroke="black" />
          </Group>
        );
      case 'vessel-horizontal':
        return (
          <Group key={componentId} {...commonProps}>
            <Rect width={60} height={40} x={-30} y={-20} fill="white" stroke="black" />
          </Group>
        );
      case 'reactor':
        return (
          <Group key={componentId} {...commonProps}>
            <Circle radius={20} fill="white" stroke="black" />
            <Line points={[0, -20, 0, -30]} stroke="black" strokeWidth={2} />
            <Line points={[0, 20, 0, 30]} stroke="black" strokeWidth={2} />
          </Group>
        );
      case 'pipe-straight':
        return (
          <Group key={componentId} {...commonProps}>
            <Line points={[-25, 0, 25, 0]} stroke="black" strokeWidth={3} />
          </Group>
        );
      case 'pipe-elbow':
        return (
          <Group key={componentId} {...commonProps}>
            <Line points={[-20, 0, 0, 0, 0, 20]} stroke="black" strokeWidth={3} />
          </Group>
        );
      case 'instrument-pressure':
        return (
          <Group key={componentId} {...commonProps}>
            <Circle radius={15} fill="white" stroke="black" />
            <Text text="PI" fontSize={12} x={-8} y={-6} />
          </Group>
        );
      case 'instrument-temperature':
        return (
          <Group key={componentId} {...commonProps}>
            <Circle radius={15} fill="white" stroke="black" />
            <Text text="TI" fontSize={12} x={-8} y={-6} />
          </Group>
        );
      default:
        return (
          <Group key={componentId} {...commonProps}>
            <Text text={component.symbol} fontSize={20} x={-15} y={-12} />
          </Group>
        );
    }
  };

  if (!isClient) {
    return <div ref={containerRef} className={styles.canvasContainer}></div>;
  }

  const gridLines = [];
  if (gridEnabled) {
    const gridSize = 20;
    const stage = stageRef.current;
    const scale = stage ? stage.scaleX() : zoom;
    const stagePos = stage ? { x: stage.x(), y: stage.y() } : { x: 0, y: 0 };
    
    const visibleStartX = -stagePos.x / scale;
    const visibleStartY = -stagePos.y / scale;
    const visibleWidth = stageSize.width / scale;
    const visibleHeight = stageSize.height / scale;
    
    const startX = Math.floor(visibleStartX / gridSize) * gridSize;
    const startY = Math.floor(visibleStartY / gridSize) * gridSize;
    const endX = visibleStartX + visibleWidth + gridSize;
    const endY = visibleStartY + visibleHeight + gridSize;
    
    for (let i = startX; i <= endX; i += gridSize) {
      gridLines.push(<Line key={`v-${i}`} points={[i, startY, i, endY]} stroke="#ddd" strokeWidth={1} />);
    }

    for (let j = startY; j <= endY; j += gridSize) {
      gridLines.push(<Line key={`h-${j}`} points={[startX, j, endX, j]} stroke="#ddd" strokeWidth={1} />);
    }
  }

  return (
    <div ref={containerRef} className={styles.canvasContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        ref={stageRef}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseDown={handleStageClick}
      >
        <Layer>
          <Rect
            x={-10000}
            y={-10000}
            width={20000}
            height={20000}
            fill="transparent"
            name="background"
            onClick={() => setSelectedId(null)}
          />
          {gridEnabled && gridLines}
          {components.map(renderComponent)}
        </Layer>
      </Stage>
      
      {contextMenu.visible && (
        <ContextMenu
          position={contextMenu}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onRotate={handleRotate}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
});

export default KonvaCanvas;