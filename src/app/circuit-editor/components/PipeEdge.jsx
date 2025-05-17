"use client";

import React, { useState, useEffect } from "react";
import { EdgeText, getBezierPath, useReactFlow } from "reactflow";
import styles from "./NodeTypes.module.css";

// Custom edge component for P&ID pipes
const PipeEdge = ({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
    selected,
}) => {
    const [edgePath, setEdgePath] = useState("");
    const [labelX, setLabelX] = useState(0);
    const [labelY, setLabelY] = useState(0);
    const { getNode } = useReactFlow();

    // Set up custom path based on type of pipe
    useEffect(() => {
        // Default bezier curve parameters
        const [path, labelX, labelY] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });

        setEdgePath(path);
        setLabelX(labelX);
        setLabelY(labelY);
    }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);

    // Determine the pipe style
    const pipeType = data?.pipeType || "main";
    const pipeColor = data?.color || "#333";
    const pipeWidth = data?.width || 2;

    // CSS classes for different pipe types
    let pipeClass = styles.pipeConnector;
    if (pipeType === "pneumatic") pipeClass += ` ${styles.pneumatic}`;
    if (pipeType === "dashed") pipeClass += ` ${styles.dashed}`;
    if (selected) pipeClass += ` ${styles.selected}`;

    const strokeStyle = {
        stroke: pipeColor,
        strokeWidth: pipeWidth,
    };

    return (
        <>
            <path
                id={id}
                className={pipeClass}
                d={edgePath}
                style={{ ...strokeStyle, ...style }}
                markerEnd={markerEnd}
            />
            {data?.label && (
                <EdgeText
                    x={labelX}
                    y={labelY}
                    label={data.label}
                    labelStyle={{ fill: "#333", fontWeight: 500 }}
                    labelBgStyle={{ fill: "white", fillOpacity: 0.8 }}
                    labelBgPadding={[2, 4]}
                    labelBgBorderRadius={2}
                />
            )}
        </>
    );
};

export default PipeEdge;
