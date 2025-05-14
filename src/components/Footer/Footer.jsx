import React from 'react';
import styles from './Footer.module.css';

const Footer = ({ zoom, position, gridEnabled, onToggleGrid, onZoomIn, onZoomOut, onZoomReset }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.statusSection}>
        <span className={styles.statusItem}>Ready</span>
      </div>
      
      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Position:</span>
          <span className={styles.value}>
            X: {position?.x || 0}, Y: {position?.y || 0}
          </span>
        </div>
        
        <div className={styles.infoItem}>
          <button 
            className={`${styles.gridToggle} ${gridEnabled ? styles.active : ''}`}
            onClick={onToggleGrid}
          >
            Grid: {gridEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>
      
      <div className={styles.zoomControls}>
        <button className={styles.zoomButton} onClick={onZoomOut} title="Zoom Out">−</button>
        <span className={styles.zoomValue} onClick={onZoomReset} title="Reset Zoom">
          {Math.round(zoom * 100)}%
        </span>
        <button className={styles.zoomButton} onClick={onZoomIn} title="Zoom In">+</button>
      </div>
    </footer>
  );
};

export default Footer;
