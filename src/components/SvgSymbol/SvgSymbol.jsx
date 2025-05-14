'use client';

import React, { useEffect, useState } from 'react';
import { Group, Image } from 'react-konva';
import Konva from 'konva';

const SvgSymbol = ({ 
  svgPath, 
  x, 
  y, 
  width, 
  height, 
  draggable, 
  onClick, 
  onDragEnd, 
  isSelected,
  rotation = 0,
  color = 'black',
  onContextMenu
}) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Load SVG as an image with the specified color
    const loadImage = () => {
      // For SVG, we can fetch and modify the content to apply color
      fetch(svgPath)
        .then(response => response.text())
        .then(svgContent => {
          // Replace any color attributes with our desired color
          const coloredSvg = svgContent.replace(/stroke="([^"]+)"/g, `stroke="${color}"`);
          
          // Create a blob from the modified SVG
          const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          
          // Load the image from the blob URL
          const img = new window.Image();
          img.src = url;
          img.onload = () => {
            setImage(img);
            URL.revokeObjectURL(url); // Clean up
          };
        })
        .catch(err => {
          console.error("Error loading SVG:", err);
          // Fallback to direct loading if fetch fails
          const img = new window.Image();
          img.src = svgPath;
          img.onload = () => setImage(img);
        });
    };
    
    loadImage();
  }, [svgPath, color]); // Re-run when color changes

  if (!image) {
    return null; // Return null while loading
  }

  return (
    <Group
      x={x + width / 2}
      y={y + height / 2}
      rotation={rotation}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
      onContextMenu={onContextMenu}
    >
      <Image
        image={image}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        stroke={isSelected ? 'blue' : undefined}
        strokeWidth={isSelected ? 2 : 0}
      />
    </Group>
  );
};

export default SvgSymbol;