import { SyllablastModel } from './model';

// Scaling constants for the canvas
const BOXSIZE = 100; // Size of each syllable block
const OFFSET = 8; // Spacing offset for syllables

// Function to compute rectangle position for a syllable
function computeRectangle(row: number, col: number) {
  return new Rectangle(
    BOXSIZE * col + OFFSET,
    BOXSIZE * row + OFFSET,
    BOXSIZE - 2 * OFFSET,
    BOXSIZE - 2 * OFFSET
  );
}

// Represents a rectangle, used for drawing and hit-testing
class Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Check if a point is inside the rectangle
  contains(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
}

// Draw the Syllablast board with adjusted syllable sizes and interaction
function drawBoard(
  ctx: CanvasRenderingContext2D,
  model: SyllablastModel,
  selected: [number, number] | null
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas

  model.board.grid.forEach((row, rowIndex) => {
    row.forEach((syllable, colIndex) => {
      const rect = computeRectangle(rowIndex, colIndex);

      // Set the default styles for cells
      ctx.fillStyle = 'lightblue';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      // Highlight correct positions in green
      if (model.board.getCorrectPositions()[rowIndex][colIndex]) {
        ctx.fillStyle = 'lightgreen';
      }

      // Highlight last swapped syllables with a thick border
      if (
        (model.board.lastSwapped.from &&
          model.board.lastSwapped.from[0] === rowIndex &&
          model.board.lastSwapped.from[1] === colIndex) ||
        (model.board.lastSwapped.to &&
          model.board.lastSwapped.to[0] === rowIndex &&
          model.board.lastSwapped.to[1] === colIndex)
      ) {
        ctx.strokeStyle = 'black'; // Use a distinct color for the border
        ctx.lineWidth = 4; // Increase border thickness
      }

      // Highlight selected syllable with a thicker border
      if (selected && selected[0] === rowIndex && selected[1] === colIndex) {
        ctx.strokeStyle = 'black'; // Use a distinct color for the selected border
        ctx.lineWidth = 4; // Increase border thickness for the selected syllable
      }

      // Draw the syllable cell with border
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Adjust font size and position for better readability
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial'; // Increase font size
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        syllable,
        rect.x + rect.width / 2,
        rect.y + rect.height / 2
      ); // Center text
    });
  });
}

/// Redraw the canvas with the updated state of the game
export function redrawCanvas(
  model: SyllablastModel,
  canvas: HTMLCanvasElement,
  selected: [number, number] | null,
  setSelected: React.Dispatch<React.SetStateAction<[number, number] | null>>,
  swap: (pos1: [number, number], pos2: [number, number]) => void
) {
  const ctx = canvas.getContext('2d');

  if (ctx) {
    drawBoard(ctx, model, selected);

    // Add click listener to the canvas to detect syllable clicks
    canvas.onclick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;  // Calculate x relative to the canvas
      const y = event.clientY - rect.top;   // Calculate y relative to the canvas

      // // Log the actual coordinates detected by the canvas
      // console.log(`Click detected at x: ${x}, y: ${y}`);

      // Find clicked syllable
      model.board.grid.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          const rect = computeRectangle(rowIndex, colIndex);
          if (rect.contains(x, y)) {
            if (selected) {
              // Swap if another syllable is already selected
              swap(selected, [rowIndex, colIndex]);
              setSelected(null);
            } else {
              // Select syllable
              setSelected([rowIndex, colIndex]);
            }
          }
        });
      });
    };
  }
}

