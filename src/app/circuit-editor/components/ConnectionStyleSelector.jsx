"use client";

import React, { useState } from "react";
import styles from "./ConnectionStyleSelector.module.css";

const ConnectionStyleSelector = ({
    connectionType,
    setConnectionType,
    connectionColor,
    setConnectionColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const connectionTypes = [
        { value: "default", label: "Straight" },
        { value: "step", label: "Orthogonal" },
        { value: "smoothstep", label: "Smooth Orthogonal" },
        { value: "bezier", label: "Bezier Curve" },
        { value: "bidirectional", label: "Bidirectional" },
        { value: "pipe", label: "P&ID Pipe (Main)" },
    ];

    const pipeStyles = [
        {
            value: "main",
            label: "Main Pipe",
            type: "pipe",
            data: { pipeType: "main" },
        },
        {
            value: "pneumatic",
            label: "Pneumatic Pipe",
            type: "pipe",
            data: { pipeType: "pneumatic" },
        },
        {
            value: "dashed",
            label: "Dashed Pipe",
            type: "pipe",
            data: { pipeType: "dashed" },
        },
    ];

    const colors = [
        { value: "#555", label: "Default (Gray)" },
        { value: "#000", label: "Black" },
        { value: "#2196F3", label: "Blue" },
        { value: "#4CAF50", label: "Green" },
        { value: "#F44336", label: "Red" },
        { value: "#FFC107", label: "Yellow" },
    ];

    const handleTypeChange = (type) => {
        setConnectionType(type);
        if (type === "pipe") {
            // When selecting pipe, set color differently to make it visible
            setConnectionColor("#000");
        }
    };

    const handlePipeStyleSelect = (pipeStyle) => {
        setConnectionType("pipe");
        // Store the pipe type data in the connectionType
        if (window.localStorage) {
            window.localStorage.setItem("pipeStyle", JSON.stringify(pipeStyle));
        }
    };

    return (
        <div className={styles.selectorContainer}>
            <button className={styles.selectorButton} onClick={toggleMenu}>
                Connection Style
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.section}>
                        <h4>Connection Type</h4>
                        <div className={styles.options}>
                            {connectionTypes.map((type) => (
                                <div
                                    key={type.value}
                                    className={`${styles.option} ${
                                        connectionType === type.value
                                            ? styles.selected
                                            : ""
                                    }`}
                                    onClick={() => handleTypeChange(type.value)}
                                >
                                    {type.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {connectionType === "pipe" && (
                        <div className={styles.section}>
                            <h4>Pipe Style</h4>
                            <div className={styles.options}>
                                {pipeStyles.map((style) => (
                                    <div
                                        key={style.value}
                                        className={styles.option}
                                        onClick={() =>
                                            handlePipeStyleSelect(style)
                                        }
                                    >
                                        {style.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h4>Connection Color</h4>
                        <div className={styles.colorOptions}>
                            {colors.map((color) => (
                                <div
                                    key={color.value}
                                    className={`${styles.colorOption} ${
                                        connectionColor === color.value
                                            ? styles.selectedColor
                                            : ""
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() =>
                                        setConnectionColor(color.value)
                                    }
                                    title={color.label}
                                >
                                    {connectionColor === color.value && (
                                        <span>✓</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionStyleSelector;
