import React from 'react';
import styles from './ConnectionStyleSelector.module.css';

const connectionStyles = [
  { id: 'smoothstep', label: 'Smooth Step', icon: '〰️' },
  { id: 'straight', label: 'Straight', icon: '➖' },
  { id: 'step', label: 'Step', icon: '┐┌' },
  { id: 'bezier', label: 'Bezier', icon: '⤳' }
];

const ConnectionStyleSelector = ({ currentStyle, onStyleChange }) => {
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
    </div>
  );
};

export default ConnectionStyleSelector; 