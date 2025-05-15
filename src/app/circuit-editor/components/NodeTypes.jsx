'use client';

import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import styles from './NodeTypes.module.css';

// Basic component with inputs and outputs on all sides
const BaseCircuitComponent = memo(({ data, selected }) => {
  return (
    <div 
      className={`${styles.circuitNode} ${selected ? styles.selected : ''}`}
      style={{ 
        borderColor: data.borderColor || '#1A192B',
        backgroundColor: data.backgroundColor || '#ffffff' 
      }}
    >
      {/* Left handle (input) */}
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      
      {/* Top handle (input) */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      
      <div className={styles.content}>
        {data.icon && <div className={styles.icon}>{data.icon}</div>}
        <div className={styles.label}>{data.label}</div>
      </div>
      
      {/* Right handle (output) */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      
      {/* Bottom handle (output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Resistor component with multi-directional handles
const ResistorNode = memo(({ data, selected }) => {
  return (
    <div className={`${styles.circuitNode} ${styles.resistor} ${selected ? styles.selected : ''}`}>
      {/* Left handle (input) */}
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      
      {/* Top handle (input) */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      
      <div className={styles.resistorSymbol}>
        <div className={styles.resistorBody}>
          <div className={styles.zigzag}></div>
        </div>
      </div>
      <div className={styles.label}>{data.label || 'Resistor'}</div>
      {data.value && <div className={styles.value}>{data.value}</div>}
      
      {/* Right handle (output) */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      
      {/* Bottom handle (output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Capacitor component with multi-directional handles
const CapacitorNode = memo(({ data, selected }) => {
  return (
    <div className={`${styles.circuitNode} ${styles.capacitor} ${selected ? styles.selected : ''}`}>
      {/* Left handle (input) */}
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      
      {/* Top handle (input) */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      
      <div className={styles.capacitorSymbol}>
        <div className={styles.capacitorPlate}></div>
        <div className={styles.capacitorGap}></div>
        <div className={styles.capacitorPlate}></div>
      </div>
      <div className={styles.label}>{data.label || 'Capacitor'}</div>
      {data.value && <div className={styles.value}>{data.value}</div>}
      
      {/* Right handle (output) */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      
      {/* Bottom handle (output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Inductor component with multi-directional handles
const InductorNode = memo(({ data, selected }) => {
  return (
    <div className={`${styles.circuitNode} ${styles.inductor} ${selected ? styles.selected : ''}`}>
      {/* Left handle (input) */}
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      
      {/* Top handle (input) */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      
      <div className={styles.inductorSymbol}>
        <div className={styles.loopContainer}>
          <div className={styles.loop}></div>
          <div className={styles.loop}></div>
          <div className={styles.loop}></div>
        </div>
      </div>
      <div className={styles.label}>{data.label || 'Inductor'}</div>
      {data.value && <div className={styles.value}>{data.value}</div>}
      
      {/* Right handle (output) */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      
      {/* Bottom handle (output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Diode component
const DiodeNode = memo(({ data, selected }) => {
  return (
    <div className={`${styles.circuitNode} ${styles.diode} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      <div className={styles.diodeSymbol}>
        <div className={styles.diodeLine}></div>
        <div className={styles.diodeTriangle}></div>
      </div>
      <div className={styles.label}>{data.label || 'Diode'}</div>
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Battery/Source component
const BatteryNode = memo(({ data, selected }) => {
  return (
    <div className={`${styles.circuitNode} ${styles.battery} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      <div className={styles.batterySymbol}>
        <div className={styles.batteryNegative}></div>
        <div className={styles.batteryPositive}></div>
      </div>
      <div className={styles.label}>{data.label || 'Battery'}</div>
      {data.voltage && <div className={styles.value}>{data.voltage}</div>}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Switch component with interactive state
const SwitchNode = memo(({ data, selected }) => {
  const [isOpen, setIsOpen] = useState(data.state === 'open');
  
  // Toggle switch state on click
  const toggleSwitch = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // You would have the parent component listen for this event
    // and update the node data accordingly
    if (data.onChange) {
      data.onChange({
        ...data,
        state: newState ? 'open' : 'closed'
      });
    }
  };
  
  return (
    <div 
      className={`${styles.circuitNode} ${styles.switch} ${selected ? styles.selected : ''}`}
      onClick={toggleSwitch}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        id="left-input"
      />
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      <div className={styles.switchSymbol}>
        <div className={styles.switchLine}></div>
        <div 
          className={`${styles.switchLever} ${isOpen || data.state === 'open' ? styles.switchOpen : ''}`}
        ></div>
      </div>
      <div className={styles.label}>{data.label || 'Switch'}</div>
      <div className={styles.switchState}>{isOpen || data.state === 'open' ? 'Open' : 'Closed'}</div>
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        id="right-output"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
    </div>
  );
});

// Ground component (keep only top handle since ground is usually at the bottom)
const GroundNode = memo(({ data, selected }) => {
  return (
    <div className={`${styles.circuitNode} ${styles.ground} ${selected ? styles.selected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      <div className={styles.groundSymbol}>
        <div className={styles.groundLine}></div>
        <div className={styles.groundLinesContainer}>
          <div className={styles.groundLineSmall}></div>
          <div className={styles.groundLineMedium}></div>
          <div className={styles.groundLineLarge}></div>
        </div>
      </div>
      <div className={styles.label}>{data.label || 'Ground'}</div>
    </div>
  );
});

// IC/Custom component with multiple inputs/outputs
const ICNode = memo(({ data, selected }) => {
  const inputCount = data.inputs || 3;
  const outputCount = data.outputs || 3;
  
  // Additional handles at top and bottom
  return (
    <div 
      className={`${styles.circuitNode} ${styles.ic} ${selected ? styles.selected : ''}`}
      style={{ minWidth: '120px', minHeight: '80px' }}
    >
      {/* Input handles on left side */}
      {Array.from({ length: inputCount }).map((_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          className={styles.handle}
          style={{ top: `${(i + 1) * 100 / (inputCount + 1)}%` }}
        />
      ))}
      
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        id="top-input"
      />
      
      <div className={styles.content}>
        {data.icon && <div className={styles.icon}>{data.icon}</div>}
        <div className={styles.label}>{data.label || 'IC'}</div>
        <div className={styles.icInfo}>
          {inputCount} in / {outputCount} out
        </div>
      </div>
      
      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        id="bottom-output"
      />
      
      {/* Output handles on right side */}
      {Array.from({ length: outputCount }).map((_, i) => (
        <Handle
          key={`output-${i}`}
          type="source"
          position={Position.Right}
          id={`output-${i}`}
          className={styles.handle}
          style={{ top: `${(i + 1) * 100 / (outputCount + 1)}%` }}
        />
      ))}
    </div>
  );
});

export const nodeTypes = {
  baseComponent: BaseCircuitComponent,
  resistor: ResistorNode,
  capacitor: CapacitorNode,
  inductor: InductorNode,
  diode: DiodeNode,
  battery: BatteryNode,
  switch: SwitchNode,
  ground: GroundNode,
  ic: ICNode,
}; 