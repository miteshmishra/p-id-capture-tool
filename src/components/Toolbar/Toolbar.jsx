import React, { useState } from 'react';
import styles from './Toolbar.module.css';

const Toolbar = ({ 
  onToolSelect, 
  selectedTool,
  onComponentSelect,
  onSave,
  onExport,
  onClear,
  onZoomIn,
  onZoomOut,
  onZoomFit
}) => {
  const [activeCategory, setActiveCategory] = useState('basic');

  // Tool categories
  const categories = [
    { id: 'basic', name: 'Basic' },
    { id: 'valves', name: 'Valves' },
    { id: 'pumps', name: 'Pumps' },
    { id: 'vessels', name: 'Vessels' },
    { id: 'instruments', name: 'Instruments' },
    { id: 'piping', name: 'Piping' }
  ];

  // Components organized by category
  const components = {
    basic: [
      { id: 'select', name: 'Select', icon: '↖️', type: 'tool' },
      { id: 'pan', name: 'Pan', icon: '✋', type: 'tool' },
      { id: 'text', name: 'Text', icon: 'T', type: 'tool' },
      { id: 'line', name: 'Line', icon: '⁄', type: 'tool' },
      { id: 'rectangle', name: 'Rectangle', icon: '□', type: 'tool' },
      { id: 'circle', name: 'Circle', icon: '○', type: 'tool' },
      { id: 'eraser', name: 'Eraser', icon: '🧽', type: 'tool' },
    ],
    valves: [
      { id: 'gate-valve', name: 'Gate Valve', icon: '⊣⊢', type: 'component' },
      { id: 'globe-valve', name: 'Globe Valve', icon: '◯⊥', type: 'component' },
      { id: 'check-valve', name: 'Check Valve', icon: '◯>', type: 'component' },
      { id: 'control-valve', name: 'Control Valve', icon: '◯X', type: 'component' },
      { id: 'relief-valve', name: 'Relief Valve', icon: '◯↑', type: 'component' },
    ],
    pumps: [
      { id: 'centrifugal-pump', name: 'Centrifugal Pump', icon: '⚙️', type: 'component' },
      { id: 'positive-displacement', name: 'Positive Displacement', icon: '⟳', type: 'component' },
      { id: 'compressor', name: 'Compressor', icon: '◯⚙️', type: 'component' },
    ],
    vessels: [
      { id: 'tank', name: 'Tank', icon: '🛢️', type: 'component' },
      { id: 'reactor', name: 'Reactor', icon: '⚗️', type: 'component' },
      { id: 'column', name: 'Column', icon: '⬚', type: 'component' },
      { id: 'heat-exchanger', name: 'Heat Exchanger', icon: '⟿', type: 'component' },
    ],
    instruments: [
      { id: 'pressure-gauge', name: 'Pressure Gauge', icon: 'P', type: 'component' },
      { id: 'temperature-gauge', name: 'Temperature Gauge', icon: 'T', type: 'component' },
      { id: 'flow-meter', name: 'Flow Meter', icon: 'F', type: 'component' },
      { id: 'level-indicator', name: 'Level Indicator', icon: 'L', type: 'component' },
    ],
    piping: [
      { id: 'pipe', name: 'Pipe', icon: '━', type: 'component' },
      { id: 'elbow', name: 'Elbow', icon: '┛', type: 'component' },
      { id: 'tee', name: 'Tee', icon: '┳', type: 'component' },
      { id: 'cross', name: 'Cross', icon: '╋', type: 'component' },
    ]
  };

  const handleItemClick = (item) => {
    if (item.type === 'tool') {
      onToolSelect(item.id);
    } else {
      onComponentSelect(item);
    }
  };

  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.topToolbar}>
        <div className={styles.fileOperations}>
          <button className={styles.fileButton} onClick={onSave}>Save</button>
          <button className={styles.fileButton} onClick={onExport}>Export</button>
          <button className={styles.fileButton} onClick={onClear}>New</button>
        </div>
        <div className={styles.viewControls}>
          <button className={styles.viewButton} onClick={onZoomIn}>Zoom In</button>
          <button className={styles.viewButton} onClick={onZoomOut}>Zoom Out</button>
          <button className={styles.viewButton} onClick={onZoomFit}>Fit</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left sidebar with component categories - similar to CircuitLab */}
        <div className={styles.sidebarContainer}>
          <div className={styles.categorySidebar}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.activeCategory : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className={styles.toolsPanel}>
            <h3>{categories.find(c => c.id === activeCategory)?.name} Components</h3>
            <div className={styles.toolGrid}>
              {components[activeCategory].map(item => (
                <div
                  key={item.id}
                  className={`${styles.toolButton} ${selectedTool === item.id ? styles.selected : ''}`}
                  onClick={() => handleItemClick(item)}
                  title={item.name}
                  draggable={item.type === 'component'}
                  onDragStart={(e) => {
                    if (item.type === 'component') {
                      e.dataTransfer.setData('application/pid-component', JSON.stringify(item));
                    }
                  }}
                >
                  <div className={styles.toolIcon}>{item.icon}</div>
                  <div className={styles.toolName}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.propertiesPanel}>
          <h3>Properties</h3>
          {selectedTool !== 'select' ? (
            <div className={styles.propertyGroups}>
              <div className={styles.propertyGroup}>
                <label>Tag Number:</label>
                <input type="text" placeholder="Enter tag" />
              </div>
              <div className={styles.propertyGroup}>
                <label>Size:</label>
                <select>
                  <option>1/4"</option>
                  <option>1/2"</option>
                  <option>3/4"</option>
                  <option>1"</option>
                  <option>2"</option>
                </select>
              </div>
              <div className={styles.propertyGroup}>
                <label>Line Style:</label>
                <select>
                  <option>Solid</option>
                  <option>Dashed</option>
                  <option>Dotted</option>
                </select>
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              Select an element to edit its properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;