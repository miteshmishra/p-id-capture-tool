"use client";

import React from "react";
import styles from "./CircuitComponentsPanel.module.css";

const CircuitComponentsPanel = ({ onComponentSelect }) => {
    // Add drag start handler
    const onDragStart = (event, component) => {
        event.dataTransfer.setData(
            "application/circuit-component",
            JSON.stringify(component)
        );
        event.dataTransfer.effectAllowed = "move";
    };

    const basicComponents = [
        { name: "Resistor", type: "resistor", data: { label: "Resistor" }, icon: "/symbols/instrument.svg" },
        { name: "Capacitor", type: "capacitor", data: { label: "Capacitor" }, icon: "/symbols/instrument.svg" },
        { name: "Inductor", type: "inductor", data: { label: "Inductor" }, icon: "/symbols/instrument.svg" },
        { name: "Diode", type: "diode", data: { label: "Diode" }, icon: "/symbols/instrument.svg" },
        { name: "Battery", type: "battery", data: { label: "Battery" }, icon: "/symbols/instrument.svg" },
        {
            name: "Switch",
            type: "switch",
            data: { label: "Switch", state: "open" },
            icon: "/symbols/valve-ball.svg"
        },
        { name: "Ground", type: "ground", data: { label: "Ground" }, icon: "/symbols/pipe-main.svg" },
    ];

    const advancedComponents = [
        {
            name: "IC/Chip",
            type: "ic",
            data: { label: "IC", inputs: 3, outputs: 3 },
            icon: "/symbols/instrument.svg"
        },
        {
            name: "Transistor",
            type: "transistor",
            data: { label: "Transistor", type: "npn" },
            icon: "/symbols/instrument.svg"
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
            icon: "/symbols/instrument.svg"
        },
        { 
            name: "Actuator", 
            type: "actuator", 
            data: { label: "Actuator" },
            icon: "/symbols/actuator-motor.svg"
        },
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
            icon: "/symbols/valve-ball.svg"
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
            icon: "/symbols/globe-valve.svg"
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
            icon: "/symbols/pump.svg"
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
            icon: "/symbols/tank.svg"
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
            icon: "/symbols/heat-exchanger.svg"
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
            icon: "/symbols/flow-meter.svg"
        },
    ];

    // Component renderer function
    const renderComponentGroup = (components, title) => (
        <div className={styles.componentGroup}>
            <h3 className={styles.groupTitle}>{title}</h3>
            <div className={styles.groupItems}>
                {components.map((component, index) => (
                    <div
                        key={index}
                        className={styles.componentItem}
                        onClick={() => onComponentSelect(component)}
                        onDragStart={(event) => onDragStart(event, component)}
                        draggable
                        title={component.name}
                    >
                        <div className={styles.componentIcon}>
                            {component.icon ? 
                                <img 
                                    src={component.icon} 
                                    alt={component.name} 
                                    width="32" 
                                    height="32" 
                                /> : 
                                component.name[0]
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.componentsPanel}>
            <div className={styles.componentsList}>
                {renderComponentGroup(basicComponents, "Basic Components")}
                {renderComponentGroup(advancedComponents, "Advanced Components")}
                {renderComponentGroup(pidComponents, "P&ID Components")}
            </div>
        </div>
    );
};

export default CircuitComponentsPanel;
