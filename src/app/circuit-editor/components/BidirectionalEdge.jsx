'use client';

import React from 'react';
import { getBezierPath, EdgeText, BaseEdge, EdgeLabelRenderer } from 'reactflow';

const BidirectionalEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  markerStart,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Create default marker for source end
  const defaultMarkerStart = {
    type: 'arrow',
    width: 15,
    height: 15,
    color: style.stroke || '#555',
  };

  // Create default marker for target end
  const defaultMarkerEnd = {
    type: 'arrow',
    width: 15,
    height: 15,
    color: style.stroke || '#555',
  };

  // Use either the provided markers or the defaults
  const actualMarkerStart = markerStart || defaultMarkerStart;
  const actualMarkerEnd = markerEnd || defaultMarkerEnd;

  // Create marker IDs
  const startMarkerId = `${id}-start-marker`;
  const endMarkerId = `${id}-end-marker`;

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        style={style}
        markerEnd={`url(#${endMarkerId})`}
        markerStart={`url(#${startMarkerId})`}
      />
      
      {/* Create the start marker (arrow) */}
      <defs>
        <marker
          id={startMarkerId}
          markerWidth={actualMarkerStart.width}
          markerHeight={actualMarkerStart.height}
          refX={actualMarkerStart.width - 5}
          refY={actualMarkerStart.height / 2}
          orient="auto-start-reverse"
        >
          <path
            d={`M 0 0 L ${actualMarkerStart.width} ${actualMarkerStart.height / 2} L 0 ${actualMarkerStart.height} z`}
            fill={actualMarkerStart.color}
          />
        </marker>
      </defs>
      
      {/* Create the end marker (arrow) */}
      <defs>
        <marker
          id={endMarkerId}
          markerWidth={actualMarkerEnd.width}
          markerHeight={actualMarkerEnd.height}
          refX={0}
          refY={actualMarkerEnd.height / 2}
          orient="auto"
        >
          <path
            d={`M 0 ${actualMarkerEnd.height / 2} L ${actualMarkerEnd.width} 0 L ${actualMarkerEnd.width} ${actualMarkerEnd.height} z`}
            fill={actualMarkerEnd.color}
          />
        </marker>
      </defs>
      
      {/* Display edge label if provided */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '2px 4px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              pointerEvents: 'all',
              border: '1px solid #ccc',
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default BidirectionalEdge; 