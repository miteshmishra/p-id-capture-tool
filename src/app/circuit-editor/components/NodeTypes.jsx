"use client";

import React, { memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import styles from "./NodeTypes.module.css";
import Image from "next/image";
// Basic component with inputs and outputs on all sides
const BaseCircuitComponent = memo(({ data, selected }) => {
    return (
        <div
            className={`${styles.circuitNode} ${
                selected ? styles.selected : ""
            }`}
            style={{
                borderColor: data.borderColor || "#1A192B",
                backgroundColor: data.backgroundColor || "#ffffff",
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
        <div
            className={`${styles.circuitNode} ${styles.resistor} ${
                selected ? styles.selected : ""
            }`}
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

            <div className={styles.resistorSymbol}>
                <div className={styles.resistorBody}>
                    <div className={styles.zigzag}></div>
                </div>
            </div>
            <div className={styles.label}>{data.label || "Resistor"}</div>
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
        <div
            className={`${styles.circuitNode} ${styles.capacitor} ${
                selected ? styles.selected : ""
            }`}
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

            <div className={styles.capacitorSymbol}>
                <div className={styles.capacitorPlate}></div>
                <div className={styles.capacitorGap}></div>
                <div className={styles.capacitorPlate}></div>
            </div>
            <div className={styles.label}>{data.label || "Capacitor"}</div>
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
        <div
            className={`${styles.circuitNode} ${styles.inductor} ${
                selected ? styles.selected : ""
            }`}
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

            <div className={styles.inductorSymbol}>
                <div className={styles.loopContainer}>
                    <div className={styles.loop}></div>
                    <div className={styles.loop}></div>
                    <div className={styles.loop}></div>
                </div>
            </div>
            <div className={styles.label}>{data.label || "Inductor"}</div>
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
        <div
            className={`${styles.circuitNode} ${styles.diode} ${
                selected ? styles.selected : ""
            }`}
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
            <div className={styles.diodeSymbol}>
                <div className={styles.diodeLine}></div>
                <div className={styles.diodeTriangle}></div>
            </div>
            <div className={styles.label}>{data.label || "Diode"}</div>
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
        <div
            className={`${styles.circuitNode} ${styles.battery} ${
                selected ? styles.selected : ""
            }`}
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
            <div className={styles.batterySymbol}>
                <div className={styles.batteryNegative}></div>
                <div className={styles.batteryPositive}></div>
            </div>
            <div className={styles.label}>{data.label || "Battery"}</div>
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
    const [isOpen, setIsOpen] = useState(data.state === "open");

    // Toggle switch state on click
    const toggleSwitch = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        // You would have the parent component listen for this event
        // and update the node data accordingly
        if (data.onChange) {
            data.onChange({
                ...data,
                state: newState ? "open" : "closed",
            });
        }
    };

    return (
        <div
            className={`${styles.circuitNode} ${styles.switch} ${
                selected ? styles.selected : ""
            }`}
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
                    className={`${styles.switchLever} ${
                        isOpen || data.state === "open" ? styles.switchOpen : ""
                    }`}
                ></div>
            </div>
            <div className={styles.label}>{data.label || "Switch"}</div>
            <div className={styles.switchState}>
                {isOpen || data.state === "open" ? "Open" : "Closed"}
            </div>
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
        <div
            className={`${styles.circuitNode} ${styles.ground} ${
                selected ? styles.selected : ""
            }`}
        >
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
            <div className={styles.label}>{data.label || "Ground"}</div>
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
            className={`${styles.circuitNode} ${styles.ic} ${
                selected ? styles.selected : ""
            }`}
            style={{ minWidth: "120px", minHeight: "80px" }}
        >
            {/* Input handles on left side */}
            {Array.from({ length: inputCount }).map((_, i) => (
                <Handle
                    key={`input-${i}`}
                    type="target"
                    position={Position.Left}
                    id={`input-${i}`}
                    className={styles.handle}
                    style={{ top: `${((i + 1) * 100) / (inputCount + 1)}%` }}
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
                <div className={styles.label}>{data.label || "IC"}</div>
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
                    style={{ top: `${((i + 1) * 100) / (outputCount + 1)}%` }}
                />
            ))}
        </div>
    );
});

// Transistor component using SVG
const TransistorNode = memo(({ data, selected }) => {
    return (
        <div
            className={`${styles.circuitNode} ${styles.transistor} ${
                selected ? styles.selected : ""
            }`}
        >
            {/* Handles for connections */}
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handle}
                id="base-input"
            />
            <Handle
                type="source"
                position={Position.Top}
                className={styles.handle}
                id="collector-output"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className={styles.handle}
                id="emitter-output"
            />

            {/* SVG Transistor Symbol */}
            <svg
                width="40"
                height="50"
                viewBox="0 0 40 50"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.transistorSvg}
            >
                {/* Base line */}
                <line
                    x1="0"
                    y1="25"
                    x2="15"
                    y2="25"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* Vertical line (body) */}
                <line
                    x1="15"
                    y1="10"
                    x2="15"
                    y2="40"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* Collector line */}
                <line
                    x1="15"
                    y1="10"
                    x2="25"
                    y2="0"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <line
                    x1="25"
                    y1="0"
                    x2="25"
                    y2="5"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* Emitter line */}
                <line
                    x1="15"
                    y1="40"
                    x2="25"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <line
                    x1="25"
                    y1="45"
                    x2="25"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* Arrow for NPN or PNP depending on data.type */}
                {data.type !== "pnp" ? (
                    // NPN (arrow pointing inward)
                    <polygon points="19,35 25,40 21,29" fill="currentColor" />
                ) : (
                    // PNP (arrow pointing outward)
                    <polygon points="21,31 15,25 21,19" fill="currentColor" />
                )}
            </svg>

            <div className={styles.label}>{data.label || "Transistor"}</div>
            {data.type && (
                <div className={styles.value}>{data.type.toUpperCase()}</div>
            )}
        </div>
    );
});

// Microcontroller component with complex SVG
const MicrocontrollerNode = memo(({ data, selected }) => {
    const inputCount = data.inputs || 8;
    const outputCount = data.outputs || 8;

    return (
        <div
            className={`${styles.circuitNode} ${styles.microcontroller} ${
                selected ? styles.selected : ""
            }`}
            style={{
                minWidth: "140px",
                minHeight: "100px",
                backgroundColor: data.backgroundColor || "#f0f8ff",
            }}
        >
            {/* Input handles on left side */}
            {Array.from({ length: inputCount }).map((_, i) => (
                <Handle
                    key={`input-${i}`}
                    type="target"
                    position={Position.Left}
                    id={`input-${i}`}
                    className={styles.handle}
                    style={{ top: `${((i + 1) * 100) / (inputCount + 1)}%` }}
                />
            ))}

            {/* Output handles on right side */}
            {Array.from({ length: outputCount }).map((_, i) => (
                <Handle
                    key={`output-${i}`}
                    type="source"
                    position={Position.Right}
                    id={`output-${i}`}
                    className={styles.handle}
                    style={{ top: `${((i + 1) * 100) / (outputCount + 1)}%` }}
                />
            ))}

            <div className={styles.microcontrollerSvgContainer}>
                <svg
                    width="120"
                    height="80"
                    viewBox="0 0 120 80"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.microcontrollerSvg}
                >
                    {/* Main chip body */}
                    <rect
                        x="10"
                        y="10"
                        width="100"
                        height="60"
                        rx="2"
                        fill="#333"
                        stroke="#000"
                        strokeWidth="1"
                    />

                    {/* Notch to indicate pin 1 */}
                    <circle cx="20" cy="15" r="3" fill="#555" />

                    {/* Pin markings - left side */}
                    {Array.from({ length: inputCount }).map((_, i) => (
                        <text
                            key={`pin-left-${i}`}
                            x="15"
                            y={15 + (i + 1) * (50 / (inputCount + 1))}
                            fontSize="6"
                            fill="#fff"
                            textAnchor="middle"
                        >
                            {i + 1}
                        </text>
                    ))}

                    {/* Pin markings - right side */}
                    {Array.from({ length: outputCount }).map((_, i) => (
                        <text
                            key={`pin-right-${i}`}
                            x="105"
                            y={15 + (i + 1) * (50 / (outputCount + 1))}
                            fontSize="6"
                            fill="#fff"
                            textAnchor="middle"
                        >
                            {inputCount + i + 1}
                        </text>
                    ))}

                    {/* Chip label */}
                    <text
                        x="60"
                        y="30"
                        fontSize="10"
                        fill="#fff"
                        textAnchor="middle"
                    >
                        {data.chipModel || "MCU"}
                    </text>

                    {/* Decorative elements */}
                    <rect
                        x="30"
                        y="40"
                        width="60"
                        height="20"
                        rx="2"
                        fill="#555"
                        stroke="#222"
                        strokeWidth="0.5"
                    />
                    <circle
                        cx="40"
                        cy="50"
                        r="4"
                        fill="#666"
                        stroke="#222"
                        strokeWidth="0.5"
                    />
                    <rect
                        x="50"
                        y="45"
                        width="30"
                        height="10"
                        rx="1"
                        fill="#444"
                        stroke="#222"
                        strokeWidth="0.5"
                    />
                </svg>
            </div>

            <div className={styles.label}>
                {data.label || "Microcontroller"}
            </div>
            {data.chipModel && (
                <div className={styles.value}>{data.chipModel}</div>
            )}
        </div>
    );
});

const ActuatorNode = memo(({ data, selected }) => {
    return (
        <div
            className={`${styles.circuitNode} ${
                selected ? styles.selected : ""
            }`}
        >
            {/* Left handle */}
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handle}
                id="left-input"
            />

            {/* Right handle */}
            <Handle
                type="target"
                position={Position.Right}
                className={styles.handle}
                id="right-input"
            />

            <div className={styles.nodeContent}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                    width="80"
                    height="40"
                >
                    <g stroke="black" strokeWidth="2" fill="none">
                        <line x1="0" y1="20" x2="40" y2="20" />
                        <circle cx="20" cy="20" r="10" fill="white" />
                    </g>
                </svg>
            </div>

            <div className={styles.label}>{data.label || "Actuator"}</div>
        </div>
    );
});

// P&ID Symbol Node that uses SVG files from the public/symbols folder
const PIDSymbolNode = memo(({ data, selected }) => {
    const [svgContent, setSvgContent] = useState("");

    // Load SVG content on component mount
    useEffect(() => {
        if (data.symbolPath) {
            fetch(data.symbolPath)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Failed to load SVG: ${response.status}`
                        );
                    }
                    return response.text();
                })
                .then((svgText) => {
                    // Basic sanitization to prevent script injection
                    const sanitized = svgText.replace(
                        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                        ""
                    );
                    setSvgContent(sanitized);
                })
                .catch((error) => {
                    console.error("Error loading SVG:", error);
                    setSvgContent(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><text x="5" y="30" fill="red">Error</text></svg>'
                    );
                });
        }
    }, [data.symbolPath]);

    // Create dynamic handle positions based on data.connectors
    const renderHandles = () => {
        // Default to left and right handles if no connectors specified
        const connectors = data.connectors || [
            { id: "left", position: Position.Left, type: "target" },
            { id: "right", position: Position.Right, type: "source" },
        ];

        return connectors.map((connector) => {
            // Convert string position to Position enum
            let position = connector.position;
            if (typeof position === "string") {
                switch (position.toLowerCase()) {
                    case "left":
                        position = Position.Left;
                        break;
                    case "right":
                        position = Position.Right;
                        break;
                    case "top":
                        position = Position.Top;
                        break;
                    case "bottom":
                        position = Position.Bottom;
                        break;
                }
            }

            return (
                <Handle
                    key={connector.id}
                    type={connector.type || "source"}
                    position={position}
                    id={connector.id}
                    className={styles.handle}
                    style={connector.style || {}}
                />
            );
        });
    };

    return (
        <div
        // className={`${styles.circuitNode} ${styles.pidSymbol} ${
        //     selected ? styles.selected : ""
        // }`}
        // style={{
        //     minWidth: data.width || "100px",
        //     minHeight: data.height || "60px",
        //     backgroundColor: data.backgroundColor || "white",
        // }}
        >
            {renderHandles()}

            <div>
                {svgContent ? (
                    <div
                        className={styles.svgWrapper}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                ) : (
                    <div className={styles.loadingSymbol}>Loading...</div>
                )}
            </div>

            {/* <div className={styles.label}>{data.label || "P&ID Symbol"}</div> */}
            {/* {data.info && <div className={styles.value}>{data.info}</div>} */}
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
    transistor: TransistorNode,
    microcontroller: MicrocontrollerNode,
    actuator: ActuatorNode,
    pidSymbol: PIDSymbolNode,
};
