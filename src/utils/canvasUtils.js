/**
 * Utility functions for canvas operations in the P&ID editor
 */

/**
 * Draws a line on the canvas context
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} start - Starting point {x, y}
 * @param {Object} end - Ending point {x, y}
 * @param {String} color - Line color
 * @param {Number} width - Line width
 */
export const drawLine = (ctx, start, end, color = '#000000', width = 2) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();
};

/**
 * Draws a rectangle on the canvas context
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} start - Starting point {x, y}
 * @param {Object} end - Ending point {x, y}
 * @param {String} color - Line color
 * @param {Number} width - Line width
 * @param {Boolean} fill - Whether to fill the rectangle
 */
export const drawRectangle = (ctx, start, end, color = '#000000', width = 2, fill = false) => {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(end.x - start.x);
  const h = Math.abs(end.y - start.y);
  
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  ctx.closePath();
};

/**
 * Draws a circle on the canvas context
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} center - Center point {x, y}
 * @param {Number} radius - Circle radius
 * @param {String} color - Line color
 * @param {Number} width - Line width
 * @param {Boolean} fill - Whether to fill the circle
 */
export const drawCircle = (ctx, center, radius, color = '#000000', width = 2, fill = false) => {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  ctx.closePath();
};

/**
 * Adds text to the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {String} text - The text to add
 * @param {Object} position - Position {x, y}
 * @param {String} font - Font specification
 * @param {String} color - Text color
 */
export const addText = (ctx, text, position, font = '16px Arial', color = '#000000') => {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, position.x, position.y);
};

/**
 * Clears the entire canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
export const clearCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Saves the canvas as an image
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {String} filename - The filename to save as
 */
export const saveCanvasAsImage = (canvas, filename = 'pid-diagram.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Converts canvas to JSON representation for saving
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Array} elements - Array of elements drawn on the canvas
 * @returns {Object} JSON representation of the diagram
 */
export const canvasToJSON = (canvas, elements) => {
  return {
    width: canvas.width,
    height: canvas.height,
    elements: elements,
    thumbnail: canvas.toDataURL('image/png'),
    timestamp: new Date().toISOString()
  };
};

/**
 * Loads a diagram from JSON representation
 * @param {Object} data - JSON representation of the diagram
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Function} setElements - Function to set the elements state
 */
export const loadFromJSON = (data, ctx, canvas, setElements) => {
  canvas.width = data.width;
  canvas.height = data.height;
  clearCanvas(ctx, canvas);
  setElements(data.elements);
  
  // Redraw all elements
  data.elements.forEach(element => {
    // Implementation depends on how elements are stored
    // This is a placeholder for the actual implementation
    console.log('Redrawing element:', element);
  });
};