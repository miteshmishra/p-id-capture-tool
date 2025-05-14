'use client';

import React from 'react';
import styles from './SymbolLibrary.module.css';
import symbolsData from '../../data/symbolsData';

const SymbolLibrary = ({ onSymbolSelect }) => {
  return (
    <div className={styles.symbolLibrary}>
      <div className={styles.categoriesContainer}>
        {symbolsData.categories.map(category => (
          <div key={category.id} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              {category.name}
            </div>
            <div className={styles.symbolGrid}>
              {category.symbols.map(symbol => (
                <div
                  key={symbol.id}
                  className={styles.symbolItem}
                  onClick={() => onSymbolSelect(symbol)}
                  title={symbol.name}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/pid-component', JSON.stringify(symbol));
                  }}
                >
                  <div className={styles.symbolIcon}>
                    {symbol.type === 'svg-component' ? (
                      <img 
                        src={symbol.svgPath} 
                        alt={symbol.name} 
                        className={styles.svgSymbol}
                        width="30"
                        height="30"
                      />
                    ) : (
                      symbol.symbol
                    )}
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

export default SymbolLibrary;