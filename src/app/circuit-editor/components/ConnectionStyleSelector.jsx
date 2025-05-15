import React from 'react';
import styles from './ConnectionStyleSelector.module.css';

const connectionStyles = [
  { id: 'smoothstep', label: 'Smooth Step', icon: '〰️' },
  { id: 'straight', label: 'Straight', icon: '➖' },
  { id: 'step', label: 'Step', icon: '┐┌' },
  { id: 'bezier', label: 'Bezier', icon: '⤳' },
  { id: 'bidirectional', label: 'Bidirectional', icon: '↔️' }
];

const connectionColors = [
  { id: '#555', label: 'Gray', hex: '#555' },
  { id: '#1a73e8', label: 'Blue', hex: '#1a73e8' },
  { id: '#d93025', label: 'Red', hex: '#d93025' },
  { id: '#188038', label: 'Green', hex: '#188038' },
  { id: '#f9ab00', label: 'Yellow', hex: '#f9ab00' },
  { id: '#9334e6', label: 'Purple', hex: '#9334e6' },
];

const ConnectionStyleSelector = ({ currentStyle, currentColor, onStyleChange, onColorChange }) => {
  return (
    <div className={styles.connectionStyleSelector}>
      <h4>Connection Style</h4>
      <div className={styles.styleOptions}>
        {connectionStyles.map((style) => (
          <button
            key={style.id}
            className={`${styles.styleButton} ${currentStyle === style.id ? styles.selected : ''}`}
            onClick={() => onStyleChange(style.id)}
            title={style.label}
          >
            <span className={styles.styleIcon}>{style.icon}</span>
            <span className={styles.styleLabel}>{style.label}</span>
          </button>
        ))}
      </div>
      
      <h4>Connection Color</h4>
      <div className={styles.colorOptions}>
        {connectionColors.map((color) => (
          <button
            key={color.id}
            className={`${styles.colorButton} ${currentColor === color.id ? styles.selected : ''}`}
            onClick={() => onColorChange(color.id)}
            title={color.label}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectionStyleSelector; 