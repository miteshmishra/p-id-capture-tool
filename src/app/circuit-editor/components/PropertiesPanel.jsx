'use client';

import React, { useState, useEffect } from 'react';
import styles from './PropertiesPanel.module.css';

const PropertiesPanel = ({ node, updateNodeData }) => {
  const [properties, setProperties] = useState({});
  
  useEffect(() => {
    if (node && node.data) {
      // Initialize properties from node data
      setProperties({ ...node.data });
    }
  }, [node]);
  
  const handlePropertyChange = (key, value) => {
    setProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleApply = () => {
    updateNodeData(node.id, properties);
  };
  
  // Skip certain keys that should not be directly editable
  const skipKeys = ['icon'];
  
  // Special rendering for specific node types
  const renderSpecialFields = () => {
    const type = node.type;
    
    switch (type) {
      case 'resistor':
        return (
          <>
            <div className={styles.propertyGroup}>
              <label>Resistance</label>
              <input 
                type="text" 
                value={properties.value || ''}
                onChange={(e) => handlePropertyChange('value', e.target.value)}
                placeholder="e.g. 1kΩ"
              />
            </div>
          </>
        );
        
      case 'capacitor':
        return (
          <>
            <div className={styles.propertyGroup}>
              <label>Capacitance</label>
              <input 
                type="text" 
                value={properties.value || ''}
                onChange={(e) => handlePropertyChange('value', e.target.value)}
                placeholder="e.g. 10μF"
              />
            </div>
          </>
        );
        
      case 'inductor':
        return (
          <>
            <div className={styles.propertyGroup}>
              <label>Inductance</label>
              <input 
                type="text" 
                value={properties.value || ''}
                onChange={(e) => handlePropertyChange('value', e.target.value)}
                placeholder="e.g. 10mH"
              />
            </div>
          </>
        );
        
      case 'battery':
        return (
          <>
            <div className={styles.propertyGroup}>
              <label>Voltage</label>
              <input 
                type="text" 
                value={properties.voltage || ''}
                onChange={(e) => handlePropertyChange('voltage', e.target.value)}
                placeholder="e.g. 9V"
              />
            </div>
          </>
        );
        
      case 'switch':
        return (
          <>
            <div className={styles.propertyGroup}>
              <label>State</label>
              <select
                value={properties.state || 'closed'}
                onChange={(e) => handlePropertyChange('state', e.target.value)}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </>
        );
        
      case 'ic':
        return (
          <>
            <div className={styles.propertyGroup}>
              <label>Input Ports</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={properties.inputs || 2}
                onChange={(e) => handlePropertyChange('inputs', parseInt(e.target.value, 10))}
              />
            </div>
            <div className={styles.propertyGroup}>
              <label>Output Ports</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={properties.outputs || 1}
                onChange={(e) => handlePropertyChange('outputs', parseInt(e.target.value, 10))}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  if (!node) return null;
  
  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.panelHeader}>
        <h3>Properties: {node.data.label}</h3>
      </div>
      <div className={styles.propertiesContainer}>
        {/* Common properties for all nodes */}
        <div className={styles.propertyGroup}>
          <label>Label</label>
          <input 
            type="text" 
            value={properties.label || ''}
            onChange={(e) => handlePropertyChange('label', e.target.value)}
          />
        </div>
        
        {/* Type-specific properties */}
        {renderSpecialFields()}
        
        {/* Dynamic properties based on node data */}
        {node.data && Object.entries(node.data)
          .filter(([key]) => !['label'].includes(key) && !skipKeys.includes(key))
          .filter(([key]) => {
            // Skip properties that are handled by special fields
            if (node.type === 'resistor' && key === 'value') return false;
            if (node.type === 'capacitor' && key === 'value') return false;
            if (node.type === 'inductor' && key === 'value') return false;
            if (node.type === 'battery' && key === 'voltage') return false;
            if (node.type === 'switch' && key === 'state') return false;
            if (node.type === 'ic' && (key === 'inputs' || key === 'outputs')) return false;
            return true;
          })
          .map(([key, value]) => (
            <div key={key} className={styles.propertyGroup}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input 
                type={typeof value === 'number' ? 'number' : 'text'} 
                value={properties[key] || ''}
                onChange={(e) => {
                  const val = typeof value === 'number' 
                    ? parseFloat(e.target.value) 
                    : e.target.value;
                  handlePropertyChange(key, val);
                }}
              />
            </div>
          ))
        }
        
        <button 
          className={styles.applyButton}
          onClick={handleApply}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel; 