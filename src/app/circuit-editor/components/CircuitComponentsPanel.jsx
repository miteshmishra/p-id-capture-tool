'use client';

import React from 'react';
import styles from './CircuitComponentsPanel.module.css';
import { circuitComponents } from '../data/circuitComponents';

const CircuitComponentsPanel = ({ onComponentSelect }) => {
  const onDragStart = (event, component) => {
    event.dataTransfer.setData('application/circuit-component', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={styles.componentsPanel}>
      <div className={styles.panelHeader}>
        <h3>Circuit Components</h3>
      </div>
      <div className={styles.categoriesContainer}>
        {circuitComponents.categories.map(category => (
          <div key={category.id} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              {category.name}
            </div>
            <div className={styles.componentGrid}>
              {category.components.map(component => (
                <div
                  key={component.id}
                  className={styles.componentItem}
                  onClick={() => onComponentSelect(component)}
                  onDragStart={(event) => onDragStart(event, component)}
                  draggable
                  title={component.label}
                >
                  <div className={styles.componentIcon}>
                    {component.icon || component.label}
                  </div>
                  <div className={styles.componentLabel}>
                    {component.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitComponentsPanel; 