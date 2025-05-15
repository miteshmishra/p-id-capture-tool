'use client';

import React, { useRef, useEffect } from 'react';
import styles from './ContextMenu.module.css';

// Available colors for edge styling
const edgeColors = [
  { color: '#555', label: 'Gray' },
  { color: '#1a73e8', label: 'Blue' },
  { color: '#d93025', label: 'Red' },
  { color: '#188038', label: 'Green' },
  { color: '#f9ab00', label: 'Yellow' },
  { color: '#9334e6', label: 'Purple' },
];

const ContextMenu = ({ 
  show, 
  position, 
  onClose, 
  onDelete, 
  onCopy, 
  onBringToFront, 
  onSendToBack,
  onRotate,
  elementType,
  onEdgeStyleChange,
  onEdgeColorChange,
  edge
}) => {
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);
  
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);
  
  if (!show) return null;
  
  return (
    <div 
      className={styles.contextMenu} 
      style={{ 
        top: position.y, 
        left: position.x 
      }}
      ref={menuRef}
    >
      <ul className={styles.menuList}>
        <li 
          className={styles.menuItem}
          onClick={() => {
            onCopy();
            onClose();
          }}
        >
          <span className={styles.icon}>📋</span>
          Copy
        </li>
        
        <li 
          className={styles.menuItem}
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <span className={styles.icon}>🗑️</span>
          Delete
        </li>
        
        <li className={styles.divider}></li>
        
        <li 
          className={styles.menuItem}
          onClick={() => {
            onBringToFront();
            onClose();
          }}
        >
          <span className={styles.icon}>⬆️</span>
          Bring to Front
        </li>
        
        <li 
          className={styles.menuItem}
          onClick={() => {
            onSendToBack();
            onClose();
          }}
        >
          <span className={styles.icon}>⬇️</span>
          Send to Back
        </li>
        
        {elementType === 'node' && (
          <>
            <li className={styles.divider}></li>
            
            <li 
              className={styles.menuItem}
              onClick={() => {
                onRotate(90);
                onClose();
              }}
            >
              <span className={styles.icon}>🔄</span>
              Rotate 90°
            </li>
            
            <li 
              className={styles.menuItem}
              onClick={() => {
                onRotate(180);
                onClose();
              }}
            >
              <span className={styles.icon}>🔄</span>
              Rotate 180°
            </li>
          </>
        )}
        
        {elementType === 'edge' && (
          <>
            <li className={styles.divider}></li>
            
            {onEdgeStyleChange && (
              <>
                <li className={styles.menuHeader}>Connection Style</li>
                
                <li 
                  className={styles.menuItem}
                  onClick={() => {
                    onEdgeStyleChange('smoothstep');
                    onClose();
                  }}
                >
                  <span className={styles.icon}>〰️</span>
                  Smooth Connection
                </li>
                
                <li 
                  className={styles.menuItem}
                  onClick={() => {
                    onEdgeStyleChange('straight');
                    onClose();
                  }}
                >
                  <span className={styles.icon}>➖</span>
                  Straight Connection
                </li>
                
                <li 
                  className={styles.menuItem}
                  onClick={() => {
                    onEdgeStyleChange('step');
                    onClose();
                  }}
                >
                  <span className={styles.icon}>┐┌</span>
                  Step Connection
                </li>
                
                <li 
                  className={styles.menuItem}
                  onClick={() => {
                    onEdgeStyleChange('bezier');
                    onClose();
                  }}
                >
                  <span className={styles.icon}>⤳</span>
                  Bezier Connection
                </li>
                
                <li 
                  className={styles.menuItem}
                  onClick={() => {
                    onEdgeStyleChange('bidirectional');
                    onClose();
                  }}
                >
                  <span className={styles.icon}>↔️</span>
                  Bidirectional
                </li>
              </>
            )}
            
            {onEdgeColorChange && (
              <>
                <li className={styles.menuHeader}>Connection Color</li>
                
                <li className={styles.colorContainer}>
                  {edgeColors.map((colorOption) => (
                    <div 
                      key={colorOption.color}
                      className={styles.colorItem}
                      style={{ backgroundColor: colorOption.color }}
                      title={colorOption.label}
                      onClick={() => {
                        onEdgeColorChange(colorOption.color);
                        onClose();
                      }}
                    />
                  ))}
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu; 