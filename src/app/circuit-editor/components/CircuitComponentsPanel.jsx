"use client";

import React, { useState } from "react";
import styles from "./CircuitComponentsPanel.module.css";

const CircuitComponentsPanel = ({ onComponentSelect }) => {
    const [activeTab, setActiveTab] = useState("basic");

    // Add drag start handler
    const onDragStart = (event, component) => {
        event.dataTransfer.setData(
            "application/circuit-component",
            JSON.stringify(component)
        );
        event.dataTransfer.effectAllowed = "move";
    };

    const basicComponents = [
        { name: "Resistor", type: "resistor", data: { label: "Resistor" } },
        { name: "Capacitor", type: "capacitor", data: { label: "Capacitor" } },
        { name: "Inductor", type: "inductor", data: { label: "Inductor" } },
        { name: "Diode", type: "diode", data: { label: "Diode" } },
        { name: "Battery", type: "battery", data: { label: "Battery" } },
        {
            name: "Switch",
            type: "switch",
            data: { label: "Switch", state: "open" },
        },
        { name: "Ground", type: "ground", data: { label: "Ground" } },
    ];

    const advancedComponents = [
        {
            name: "IC/Chip",
            type: "ic",
            data: { label: "IC", inputs: 3, outputs: 3 },
        },
        {
            name: "Transistor",
            type: "transistor",
            data: { label: "Transistor", type: "npn" },
        },
        {
            name: "Microcontroller",
            type: "microcontroller",
            data: {
                label: "MCU",
                chipModel: "ATmega328",
                inputs: 5,
                outputs: 5,
            },
        },
        { name: "Actuator", type: "actuator", data: { label: "Actuator" } },
    ];

    // Add P&ID components
    const pidComponents = [
        {
            name: "Valve (Ball)",
            type: "pidSymbol",
            data: {
                label: "Ball Valve",
                symbolPath: "/symbols/valve-ball.svg",
                info: "Ball Valve",
                width: "100px",
                height: "80px",
                connectors: [
                    { id: "left", position: "left", type: "target" },
                    { id: "right", position: "right", type: "source" },
                ],
            },
        },
        {
            name: "Valve (Globe)",
            type: "pidSymbol",
            data: {
                label: "Globe Valve",
                symbolPath: "/symbols/globe-valve.svg",
                info: "Globe Valve",
                width: "100px",
                height: "80px",
                connectors: [
                    { id: "left", position: "left", type: "target" },
                    { id: "right", position: "right", type: "source" },
                ],
            },
        },
        {
            name: "Pump",
            type: "pidSymbol",
            data: {
                label: "Pump",
                symbolPath: "/symbols/pump.svg",
                info: "Centrifugal Pump",
                width: "120px",
                height: "100px",
                connectors: [
                    { id: "left", position: "left", type: "target" },
                    { id: "right", position: "right", type: "source" },
                ],
            },
        },
        {
            name: "Tank",
            type: "pidSymbol",
            data: {
                label: "Tank",
                symbolPath: "/symbols/tank.svg",
                info: "Storage Tank",
                width: "120px",
                height: "120px",
                connectors: [
                    { id: "top", position: "top", type: "target" },
                    { id: "bottom", position: "bottom", type: "source" },
                ],
            },
        },
        {
            name: "Heat Exchanger",
            type: "pidSymbol",
            data: {
                label: "Heat Exchanger",
                symbolPath: "/symbols/heat-exchanger.svg",
                info: "Heat Exchanger",
                width: "140px",
                height: "100px",
                connectors: [
                    { id: "left", position: "left", type: "target" },
                    { id: "right", position: "right", type: "source" },
                    { id: "top", position: "top", type: "target" },
                    { id: "bottom", position: "bottom", type: "source" },
                ],
            },
        },
        {
            name: "Flow Meter",
            type: "pidSymbol",
            data: {
                label: "Flow Meter",
                symbolPath: "/symbols/flow-meter.svg",
                info: "Flow Measurement",
                width: "100px",
                height: "80px",
                connectors: [
                    { id: "left", position: "left", type: "target" },
                    { id: "right", position: "right", type: "source" },
                ],
            },
        },
    ];

    return (
        <div className={styles.componentsPanel}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${
                        activeTab === "basic" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("basic")}
                >
                    Basic
                </button>
                <button
                    className={`${styles.tab} ${
                        activeTab === "advanced" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("advanced")}
                >
                    Advanced
                </button>
                <button
                    className={`${styles.tab} ${
                        activeTab === "pid" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("pid")}
                >
                    P&ID
                </button>
            </div>

            <div className={styles.componentsList}>
                {activeTab === "basic" &&
                    basicComponents.map((component, index) => (
                        <div
                            key={index}
                            className={styles.componentItem}
                            onClick={() => onComponentSelect(component)}
                            onDragStart={(event) =>
                                onDragStart(event, component)
                            }
                            draggable
                            title={component.name}
                        >
                            <div className={styles.componentIcon}>
                                {component.icon || component.name[0]}
                            </div>
                            <div className={styles.componentLabel}>
                                {component.name}
                            </div>
                        </div>
                    ))}

                {activeTab === "advanced" &&
                    advancedComponents.map((component, index) => (
                        <div
                            key={index}
                            className={styles.componentItem}
                            onClick={() => onComponentSelect(component)}
                            onDragStart={(event) =>
                                onDragStart(event, component)
                            }
                            draggable
                            title={component.name}
                        >
                            <div className={styles.componentIcon}>
                                {component.icon || component.name[0]}
                            </div>
                            <div className={styles.componentLabel}>
                                {component.name}
                            </div>
                        </div>
                    ))}

                {activeTab === "pid" &&
                    pidComponents.map((component, index) => (
                        <div
                            key={index}
                            className={styles.componentItem}
                            onClick={() => onComponentSelect(component)}
                            onDragStart={(event) =>
                                onDragStart(event, component)
                            }
                            draggable
                            title={component.name}
                        >
                            <div className={styles.componentIcon}>
                                {component.icon ||
                                    component.name.split("(")[0][0]}
                            </div>
                            <div className={styles.componentLabel}>
                                {component.name}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CircuitComponentsPanel;
