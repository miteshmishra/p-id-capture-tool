"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
    ReactFlowProvider,
    Background,
    Controls,
    MiniMap,
    addEdge,
    Panel,
    useNodesState,
    useEdgesState,
    useKeyPress,
    useReactFlow,
    BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import styles from "./page.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CircuitComponentsPanel from "./components/CircuitComponentsPanel";
import PropertiesPanel from "./components/PropertiesPanel";
import ContextMenu from "./components/ContextMenu";
import ConnectionStyleSelector from "./components/ConnectionStyleSelector";
import BidirectionalEdge from "./components/BidirectionalEdge";
import PipeEdge from "./components/PipeEdge";
import { nodeTypes } from "./components/NodeTypes";

// Define custom edge types
const edgeTypes = {
    bidirectional: BidirectionalEdge,
    pipe: PipeEdge,
};

export default function CircuitEditor() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedElements, setSelectedElements] = useState({
        nodes: [],
        edges: [],
    });
    const [clipboard, setClipboard] = useState({ nodes: [], edges: [] });

    // Connection styling state
    const [connectionType, setConnectionType] = useState("smoothstep");
    const [connectionColor, setConnectionColor] = useState("#555");

    // Context menu state
    const [contextMenu, setContextMenu] = useState({
        show: false,
        position: { x: 0, y: 0 },
        elementId: null,
        elementType: null,
    });

    // History for undo/redo
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isUndoRedo, setIsUndoRedo] = useState(false);

    // Add a debounce timer ref for batching changes
    const timerRef = useRef(null);
    const lastChangeRef = useRef(null);

    // Keyboard shortcuts
    const deletePressed = useKeyPress("Delete");
    const backspacePressed = useKeyPress("Backspace");
    const ctrlCPressed = useKeyPress(["Meta+c", "Control+c"]);
    const ctrlVPressed = useKeyPress(["Meta+v", "Control+v"]);
    const ctrlZPressed = useKeyPress(["Meta+z", "Control+z"]);
    const ctrlYPressed = useKeyPress(["Meta+y", "Control+y"]);
    const ctrlShiftZPressed = useKeyPress(["Meta+Shift+z", "Control+Shift+z"]);

    // Save current state to history
    const saveCurrentStateToHistory = useCallback(() => {
        if (isUndoRedo) return;

        const currentState = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
        };

        // Only add to history if there's an actual change
        if (historyIndex >= 0) {
            const lastState = history[historyIndex];
            const nodesEqual =
                JSON.stringify(lastState.nodes) ===
                JSON.stringify(currentState.nodes);
            const edgesEqual =
                JSON.stringify(lastState.edges) ===
                JSON.stringify(currentState.edges);

            if (nodesEqual && edgesEqual) {
                return; // No change, don't save
            }
        }

        // Remove future states if we're in the middle of history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);

        // Limit history to 50 steps
        if (newHistory.length > 50) {
            newHistory.shift();
        }

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, nodes, edges, isUndoRedo]);

    // Handle connecting nodes
    const onConnect = useCallback(
        (params) => {
            // Validate connection
            if (!params.source || !params.target) return;

            // Generate a unique ID for the edge
            const edgeId = `edge-${params.source}-${
                params.target
            }-${Date.now()}`;

            let edgeData = {};

            // Check if we're creating a pipe connection
            if (connectionType === "pipe") {
                // Try to get pipe style from localStorage
                let pipeStyle = { pipeType: "main" };
                try {
                    const storedPipeStyle =
                        window.localStorage.getItem("pipeStyle");
                    if (storedPipeStyle) {
                        const parsedStyle = JSON.parse(storedPipeStyle);
                        pipeStyle = parsedStyle.data || { pipeType: "main" };
                    }
                } catch (error) {
                    console.error("Error parsing pipe style:", error);
                }

                // Create pipe edge with correct styling
                edgeData = {
                    ...pipeStyle,
                    color: connectionColor,
                    width: 2,
                    label: pipeStyle.label || "",
                };
            }

            // Create a proper edge with styling
            const newEdge = {
                ...params,
                id: edgeId,
                type: connectionType,
                animated: false,
                style: {
                    strokeWidth: connectionType === "pipe" ? 3 : 2,
                    stroke: connectionColor,
                },
                data: edgeData,
                // Add markers based on connection type
                markerEnd:
                    connectionType !== "pipe"
                        ? {
                              type: "arrow",
                              width: 15,
                              height: 15,
                              color: connectionColor,
                          }
                        : undefined,
                ...(connectionType === "bidirectional" && {
                    markerStart: {
                        type: "arrow",
                        width: 15,
                        height: 15,
                        color: connectionColor,
                    },
                }),
            };

            // Save state before adding new edge
            saveCurrentStateToHistory();

            // Add the edge to the state
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges, saveCurrentStateToHistory, connectionType, connectionColor]
    );

    // Enhanced validation to allow connections regardless of position
    const isValidConnection = useCallback(
        (connection) => {
            // Get the source and target nodes
            const sourceNode = nodes.find(
                (node) => node.id === connection.source
            );
            const targetNode = nodes.find(
                (node) => node.id === connection.target
            );

            // If we're missing node data, deny connection
            if (!sourceNode || !targetNode) return false;

            // Prevent connecting to self
            if (connection.source === connection.target) return false;

            // Prevent duplicate connections between the same handles
            const isDuplicate = edges.some(
                (edge) =>
                    edge.source === connection.source &&
                    edge.target === connection.target &&
                    edge.sourceHandle === connection.sourceHandle &&
                    edge.targetHandle === connection.targetHandle
            );

            if (isDuplicate) return false;

            // Allow all other connections - including loops between components
            return true;
        },
        [nodes, edges]
    );

    // Custom node change handler that saves history
    const handleNodesChange = useCallback(
        (changes) => {
            if (isUndoRedo) {
                onNodesChange(changes);
                return;
            }

            // Check if there are position changes (dragging nodes)
            const hasPositionChanges = changes.some(
                (change) =>
                    change.type === "position" &&
                    (change.position?.x !== undefined ||
                        change.position?.y !== undefined)
            );

            // Record the time of this change
            lastChangeRef.current = Date.now();

            // Apply changes immediately
            onNodesChange(changes);

            // Save state after a short delay or immediately for select/remove operations
            if (
                changes.some(
                    (change) =>
                        change.type === "remove" || change.type === "select"
                )
            ) {
                // Clear any pending timers
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }

                // For non-move operations, save state immediately
                saveCurrentStateToHistory();
            } else if (hasPositionChanges) {
                // For position changes (dragging), batch changes with a debounce
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }

                timerRef.current = setTimeout(() => {
                    saveCurrentStateToHistory();
                    timerRef.current = null;
                }, 500); // Debounce for 500ms
            }
        },
        [onNodesChange, isUndoRedo, saveCurrentStateToHistory]
    );

    // Custom edge change handler that saves history
    const handleEdgesChange = useCallback(
        (changes) => {
            if (isUndoRedo) {
                onEdgesChange(changes);
                return;
            }

            // Apply changes immediately
            onEdgesChange(changes);

            // Save state after select/remove operations
            if (
                changes.some(
                    (change) =>
                        change.type === "remove" || change.type === "select"
                )
            ) {
                // Clear any pending timers
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }

                saveCurrentStateToHistory();
            }
        },
        [onEdgesChange, isUndoRedo, saveCurrentStateToHistory]
    );

    // Handle initial state
    useEffect(() => {
        // Ensure we have a clean history start
        if (history.length === 0 && (nodes.length > 0 || edges.length > 0)) {
            saveCurrentStateToHistory();
        }
    }, [history.length, nodes, edges, saveCurrentStateToHistory]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Undo function
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setIsUndoRedo(true);
            const prevState = history[historyIndex - 1];

            // Create deep copies to avoid reference issues
            const nodesCopy = JSON.parse(JSON.stringify(prevState.nodes));
            const edgesCopy = JSON.parse(JSON.stringify(prevState.edges));

            setNodes(nodesCopy);
            setEdges(edgesCopy);
            setHistoryIndex(historyIndex - 1);

            // Delay turning off the flag to ensure state updates are complete
            setTimeout(() => setIsUndoRedo(false), 100);
        }
    }, [historyIndex, history, setNodes, setEdges]);

    // Redo function
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setIsUndoRedo(true);
            const nextState = history[historyIndex + 1];

            // Create deep copies to avoid reference issues
            const nodesCopy = JSON.parse(JSON.stringify(nextState.nodes));
            const edgesCopy = JSON.parse(JSON.stringify(nextState.edges));

            setNodes(nodesCopy);
            setEdges(edgesCopy);
            setHistoryIndex(historyIndex + 1);

            // Delay turning off the flag to ensure state updates are complete
            setTimeout(() => setIsUndoRedo(false), 100);
        }
    }, [historyIndex, history, setNodes, setEdges]);

    // Handle keyboard shortcuts
    useEffect(() => {
        if (deletePressed || backspacePressed) {
            handleDelete();
        }
    }, [deletePressed, backspacePressed]);

    useEffect(() => {
        if (ctrlCPressed) {
            handleCopy();
        }
    }, [ctrlCPressed]);

    useEffect(() => {
        if (ctrlVPressed) {
            handlePaste();
        }
    }, [ctrlVPressed]);

    useEffect(() => {
        if (ctrlZPressed) {
            handleUndo();
        }
    }, [ctrlZPressed, handleUndo]);

    useEffect(() => {
        if (ctrlYPressed || ctrlShiftZPressed) {
            handleRedo();
        }
    }, [ctrlYPressed, ctrlShiftZPressed, handleRedo]);

    // Handle dropping a new node from the sidebar
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const componentData = event.dataTransfer.getData(
                "application/circuit-component"
            );
            if (!componentData || !reactFlowInstance) return;

            try {
                const component = JSON.parse(componentData);
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                const newNode = {
                    id: `${component.type}-${Date.now()}`,
                    type: component.type,
                    position,
                    data: {
                        ...(component.data || {}),
                        label:
                            component.data?.label ||
                            component.name ||
                            component.type,
                    },
                    selected: false,
                };

                saveCurrentStateToHistory();
                setNodes((nds) => nds.concat(newNode));
            } catch (error) {
                console.error("Error creating node:", error);
            }
        },
        [reactFlowInstance, setNodes, saveCurrentStateToHistory]
    );

    // Handle component selection from panel
    const handleComponentSelect = (component) => {
        setSelectedComponent(component);
    };

    // Handle selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedElements({ nodes, edges });
    }, []);

    // Handle node/edge deletion
    const handleDelete = useCallback(() => {
        if (
            selectedElements.nodes.length > 0 ||
            selectedElements.edges.length > 0
        ) {
            saveCurrentStateToHistory();

            const selectedNodeIds = selectedElements.nodes.map(
                (node) => node.id
            );
            const selectedEdgeIds = selectedElements.edges.map(
                (edge) => edge.id
            );

            setNodes((nodes) =>
                nodes.filter((node) => !selectedNodeIds.includes(node.id))
            );
            setEdges((edges) =>
                edges.filter((edge) => !selectedEdgeIds.includes(edge.id))
            );
        } else if (contextMenu.show && contextMenu.elementId) {
            saveCurrentStateToHistory();

            if (contextMenu.elementType === "node") {
                setNodes((nodes) =>
                    nodes.filter((node) => node.id !== contextMenu.elementId)
                );
            } else if (contextMenu.elementType === "edge") {
                setEdges((edges) =>
                    edges.filter((edge) => edge.id !== contextMenu.elementId)
                );
            }

            setContextMenu({ ...contextMenu, show: false });
        }
    }, [
        selectedElements,
        setNodes,
        setEdges,
        saveCurrentStateToHistory,
        contextMenu,
    ]);

    // Handle copy
    const handleCopy = useCallback(() => {
        if (selectedElements.nodes.length > 0) {
            setClipboard({
                nodes: selectedElements.nodes,
                edges: selectedElements.edges.filter(
                    (edge) =>
                        selectedElements.nodes.some(
                            (node) => node.id === edge.source
                        ) &&
                        selectedElements.nodes.some(
                            (node) => node.id === edge.target
                        )
                ),
            });
        } else if (contextMenu.show && contextMenu.elementType === "node") {
            const nodeToCopy = nodes.find(
                (node) => node.id === contextMenu.elementId
            );
            if (nodeToCopy) {
                setClipboard({
                    nodes: [nodeToCopy],
                    edges: [],
                });
            }
        }
    }, [selectedElements, nodes, contextMenu]);

    // Handle paste
    const handlePaste = useCallback(() => {
        if (clipboard.nodes.length === 0 || !reactFlowInstance) return;

        saveCurrentStateToHistory();

        // Create a mapping from old node IDs to new node IDs
        const idMap = {};
        const now = Date.now();

        // Create new nodes with new IDs and positions offset
        const newNodes = clipboard.nodes.map((node, i) => {
            const newId = `${node.type}-${now}-${i}`;
            idMap[node.id] = newId;

            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + 50,
                    y: node.position.y + 50,
                },
                selected: false,
            };
        });

        // Create new edges with updated source/target IDs
        const newEdges = clipboard.edges.map((edge, i) => {
            const newId = `edge-${now}-${i}`;

            return {
                ...edge,
                id: newId,
                source: idMap[edge.source],
                target: idMap[edge.target],
                selected: false,
            };
        });

        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
    }, [
        clipboard,
        reactFlowInstance,
        setNodes,
        setEdges,
        saveCurrentStateToHistory,
    ]);

    // Handle Clear Canvas
    const handleClear = useCallback(() => {
        if (window.confirm("Are you sure you want to clear the canvas?")) {
            saveCurrentStateToHistory();
            setNodes([]);
            setEdges([]);
        }
    }, [setNodes, setEdges, saveCurrentStateToHistory]);

    // Handle connection type change
    const handleConnectionTypeChange = useCallback((type) => {
        setConnectionType(type);
    }, []);

    // Handle connection color change
    const handleConnectionColorChange = useCallback((color) => {
        setConnectionColor(color);
    }, []);

    // Update individual edge style
    const updateEdgeStyle = useCallback(
        (edgeId, style) => {
            if (!edgeId) return;

            saveCurrentStateToHistory();

            setEdges((edges) =>
                edges.map((edge) => {
                    if (edge.id === edgeId) {
                        // For bidirectional style, add a marker at the start
                        if (style === "bidirectional") {
                            return {
                                ...edge,
                                type: style,
                                markerStart: {
                                    type: "arrow",
                                    width: 15,
                                    height: 15,
                                    color:
                                        edge.style?.stroke || connectionColor,
                                },
                            };
                        }
                        // For other styles, remove the start marker
                        else {
                            const { markerStart, ...restEdge } = edge;
                            return {
                                ...restEdge,
                                type: style,
                            };
                        }
                    }
                    return edge;
                })
            );
        },
        [setEdges, saveCurrentStateToHistory, connectionColor]
    );

    // Update individual edge color
    const updateEdgeColor = useCallback(
        (edgeId, color) => {
            if (!edgeId) return;

            saveCurrentStateToHistory();

            setEdges((edges) =>
                edges.map((edge) => {
                    if (edge.id === edgeId) {
                        const updatedEdge = {
                            ...edge,
                            style: {
                                ...edge.style,
                                stroke: color,
                            },
                            markerEnd: {
                                ...edge.markerEnd,
                                color: color,
                            },
                        };

                        // Add markerStart update if bidirectional
                        if (edge.type === "bidirectional" && edge.markerStart) {
                            updatedEdge.markerStart = {
                                ...edge.markerStart,
                                color: color,
                            };
                        }

                        return updatedEdge;
                    }
                    return edge;
                })
            );
        },
        [setEdges, saveCurrentStateToHistory]
    );

    // Handle Save
    const handleSave = useCallback(() => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();

            // Save connection style settings with the circuit
            const dataToSave = {
                ...flow,
                settings: {
                    connectionType,
                    connectionColor,
                },
            };

            localStorage.setItem("circuit-flow", JSON.stringify(dataToSave));
            alert("Circuit saved!");
        }
    }, [reactFlowInstance, connectionType, connectionColor]);

    // Handle Load
    const handleLoad = useCallback(() => {
        const savedFlow = localStorage.getItem("circuit-flow");
        if (savedFlow && reactFlowInstance) {
            const flow = JSON.parse(savedFlow);
            saveCurrentStateToHistory();

            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);

            // Load connection style settings if they exist
            if (flow.settings) {
                if (flow.settings.connectionType) {
                    setConnectionType(flow.settings.connectionType);
                }
                if (flow.settings.connectionColor) {
                    setConnectionColor(flow.settings.connectionColor);
                }
            }

            setTimeout(() => {
                reactFlowInstance.fitView({ padding: 0.2 });
            }, 50);
        }
    }, [reactFlowInstance, setNodes, setEdges, saveCurrentStateToHistory]);

    // Handle Export (placeholder)
    const handleExport = useCallback(
        (format = "png") => {
            if (format === "png" && reactFlowInstance) {
                // This is a simplified version, you'd need to use html-to-image or a similar library
                // for production-quality screenshot exports
                alert(`Circuit exported as ${format}`);
            } else if (format === "json" && reactFlowInstance) {
                const flow = reactFlowInstance.toObject();
                const dataStr = JSON.stringify(flow, null, 2);
                const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);

                const exportFileDefaultName = `circuit-${new Date()
                    .toISOString()
                    .slice(0, 10)}.json`;

                const linkElement = document.createElement("a");
                linkElement.setAttribute("href", dataUri);
                linkElement.setAttribute("download", exportFileDefaultName);
                linkElement.click();
            }
        },
        [reactFlowInstance]
    );

    // Handle context menu
    const onContextMenu = useCallback((event, element) => {
        // Prevent default context menu
        event.preventDefault();

        if (element) {
            // Set context menu position and info
            setContextMenu({
                show: true,
                position: { x: event.clientX, y: event.clientY },
                elementId: element.id,
                elementType: element.type === "default" ? "edge" : "node",
            });
        } else {
            // Close context menu if clicking on empty canvas
            setContextMenu({
                show: false,
                position: { x: 0, y: 0 },
                elementId: null,
                elementType: null,
            });
        }
    }, []);

    // Handle closing context menu
    const closeContextMenu = useCallback(() => {
        setContextMenu({
            show: false,
            position: { x: 0, y: 0 },
            elementId: null,
            elementType: null,
        });
    }, []);

    // Bring node to front (increase zIndex)
    const bringToFront = useCallback(() => {
        saveCurrentStateToHistory();

        if (contextMenu.elementType === "node") {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === contextMenu.elementId) {
                        // Find the highest zIndex and increment it
                        const highestZIndex = Math.max(
                            0,
                            ...nds.map((n) => n.zIndex || 0)
                        );
                        return { ...node, zIndex: highestZIndex + 1 };
                    }
                    return node;
                })
            );
        }
    }, [contextMenu, setNodes, saveCurrentStateToHistory]);

    // Send node to back (decrease zIndex)
    const sendToBack = useCallback(() => {
        saveCurrentStateToHistory();

        if (contextMenu.elementType === "node") {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === contextMenu.elementId) {
                        // Find the lowest zIndex and decrement it
                        const lowestZIndex = Math.min(
                            0,
                            ...nds.map((n) => n.zIndex || 0)
                        );
                        return { ...node, zIndex: lowestZIndex - 1 };
                    }
                    return node;
                })
            );
        }
    }, [contextMenu, setNodes, saveCurrentStateToHistory]);

    // Rotate node by specified degrees
    const rotateNode = useCallback(
        (degrees) => {
            saveCurrentStateToHistory();

            if (contextMenu.elementType === "node") {
                setNodes((nds) =>
                    nds.map((node) => {
                        if (node.id === contextMenu.elementId) {
                            // Get current rotation or default to 0
                            const currentRotation = node.style?.transform
                                ? parseInt(
                                      node.style.transform
                                          .replace("rotate(", "")
                                          .replace("deg)", ""),
                                      10
                                  )
                                : 0;

                            // Calculate new rotation
                            const newRotation =
                                (currentRotation + degrees) % 360;

                            return {
                                ...node,
                                style: {
                                    ...node.style,
                                    transform: `rotate(${newRotation}deg)`,
                                },
                            };
                        }
                        return node;
                    })
                );
            }
        },
        [contextMenu, setNodes, saveCurrentStateToHistory]
    );

    // Update node data through properties panel
    const updateNodeData = useCallback(
        (nodeId, newData) => {
            saveCurrentStateToHistory();
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                ...newData,
                            },
                        };
                    }
                    return node;
                })
            );
        },
        [setNodes, saveCurrentStateToHistory]
    );

    return (
        <div className={styles.circuitEditorContainer}>
            <Header
                onNew={handleClear}
                onSave={handleSave}
                onExport={() => handleExport("json")}
            />

            <div className={styles.editorContent}>
                <CircuitComponentsPanel
                    onComponentSelect={handleComponentSelect}
                />

                <ReactFlowProvider>
                    <div
                        className={styles.reactFlowWrapper}
                        ref={reactFlowWrapper}
                    >
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={handleNodesChange}
                            onEdgesChange={handleEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            onSelectionChange={onSelectionChange}
                            onContextMenu={onContextMenu}
                            isValidConnection={isValidConnection}
                            connectionLineStyle={{
                                stroke: connectionColor,
                                strokeWidth: 2,
                            }}
                            connectionLineType={connectionType}
                            snapToGrid
                            snapGrid={[20, 20]}
                            minZoom={0.1}
                            maxZoom={10}
                            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                            defaultEdgeOptions={{
                                type: connectionType,
                                animated: false,
                                style: {
                                    strokeWidth: 2,
                                    stroke: connectionColor,
                                },
                                markerEnd: {
                                    type: "arrow",
                                },
                            }}
                            deleteKeyCode={["Delete", "Backspace"]}
                            fitView={false}
                            // Enable connections from any handle to any other handle
                            connectionMode="loose"
                        >
                            <Controls />
                            <MiniMap />
                            {/* <Background variant="lines" gap={20} size={1} /> */}
                            <Background
                                variant={BackgroundVariant.Lines}
                                gap={20} // optional: spacing between lines
                                color="#eee" // optional: line color
                            />
                            <Panel
                                position="top-right"
                                className={styles.panel}
                            >
                                <div className={styles.panelContent}>
                                    <button
                                        onClick={handleUndo}
                                        disabled={historyIndex <= 0}
                                        title="Undo (Ctrl+Z)"
                                    >
                                        Undo
                                    </button>
                                    <button
                                        onClick={handleRedo}
                                        disabled={
                                            historyIndex >= history.length - 1
                                        }
                                        title="Redo (Ctrl+Y)"
                                    >
                                        Redo
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        disabled={
                                            selectedElements.nodes.length === 0
                                        }
                                        title="Copy (Ctrl+C)"
                                    >
                                        Copy
                                    </button>
                                    <button
                                        onClick={handlePaste}
                                        disabled={clipboard.nodes.length === 0}
                                        title="Paste (Ctrl+V)"
                                    >
                                        Paste
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={
                                            selectedElements.nodes.length ===
                                                0 &&
                                            selectedElements.edges.length === 0
                                        }
                                        title="Delete (Delete)"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={handleClear}
                                        title="Clear Canvas"
                                    >
                                        Clear
                                    </button>
                                    <button onClick={handleSave} title="Save">
                                        Save
                                    </button>
                                    <button onClick={handleLoad} title="Load">
                                        Load
                                    </button>
                                    <button
                                        onClick={() => handleExport("png")}
                                        title="Export as PNG"
                                    >
                                        Export PNG
                                    </button>
                                    <button
                                        onClick={() => handleExport("json")}
                                        title="Export as JSON"
                                    >
                                        Export JSON
                                    </button>
                                </div>
                            </Panel>

                            <Panel
                                position="top-left"
                                className={`${styles.panel} ${styles.connectionPanel}`}
                            >
                                <ConnectionStyleSelector
                                    connectionType={connectionType}
                                    setConnectionType={setConnectionType}
                                    connectionColor={connectionColor}
                                    setConnectionColor={setConnectionColor}
                                />
                            </Panel>
                        </ReactFlow>

                        {/* Context Menu */}
                        <ContextMenu
                            show={contextMenu.show}
                            position={contextMenu.position}
                            onClose={closeContextMenu}
                            onDelete={handleDelete}
                            onCopy={handleCopy}
                            onBringToFront={bringToFront}
                            onSendToBack={sendToBack}
                            onRotate={rotateNode}
                            elementType={contextMenu.elementType}
                            onEdgeStyleChange={(style) =>
                                updateEdgeStyle(contextMenu.elementId, style)
                            }
                            onEdgeColorChange={(color) =>
                                updateEdgeColor(contextMenu.elementId, color)
                            }
                            edge={
                                contextMenu.elementType === "edge"
                                    ? edges.find(
                                          (edge) =>
                                              edge.id === contextMenu.elementId
                                      )
                                    : null
                            }
                        />
                    </div>

                    {selectedElements.nodes.length === 1 && (
                        <PropertiesPanel
                            node={selectedElements.nodes[0]}
                            updateNodeData={updateNodeData}
                        />
                    )}
                </ReactFlowProvider>
            </div>

            <Footer />
        </div>
    );
}
