'use client';

import React from 'react';
import styles from './ContextMenu.module.css';

const ContextMenu = ({ position, onClose, onRotate, onColorChange }) => {
  const colors = ['black', 'red', 'blue', 'green', 'orange', 'purple'];
  
  const handleRotateClick = (degrees) => {
    onRotate(degrees);
    onClose();
  };
  
  const handleColorClick = (color) => {
    onColorChange(color);
    onClose();
  };

  return (
    <div 
      className={styles.contextMenu} 
      style={{ 
        left: position.x, 
        top: position.y 
      }}
    >
      <div className={styles.menuSection}>
        <div className={styles.menuHeader}>Rotate</div>
        <div className={styles.menuItem} onClick={() => handleRotateClick(90)}>Rotate 90°</div>
        <div className={styles.menuItem} onClick={() => handleRotateClick(180)}>Rotate 180°</div>
        <div className={styles.menuItem} onClick={() => handleRotateClick(270)}>Rotate 270°</div>
        <div className={styles.menuItem} onClick={() => handleRotateClick(0)}>Reset Rotation</div>
      </div>
      
      <div className={styles.menuSection}>
        <div className={styles.menuHeader}>Color</div>
        <div className={styles.colorOptions}>
          {colors.map(color => (
            <div 
              key={color}
              className={styles.colorOption} 
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;