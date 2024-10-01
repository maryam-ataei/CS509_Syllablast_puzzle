import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import Home from './app/page'; // Update with the correct path to Home

// const { createCanvas } = require('canvas');

// // Use `createCanvas` where a canvas is required in your tests
// HTMLCanvasElement.prototype.getContext = function () {
//   return createCanvas(400, 400).getContext('2d');
// };

describe('Home Component', () => {
  // Test to check if the canvas and buttons are rendered
  it('renders the puzzle canvas, score, and buttons', () => {
    render(<Home />);

    // Check if the canvas is rendered
    const canvasElement = screen.getByTestId('puzzle-canvas'); // Use the test ID
    expect(canvasElement).not.toBeNull(); // Ensure the canvas is rendered

    // Check if the score and moves label is rendered
    const movesLabel = screen.getByText(/Moves: 0/i);
    expect(movesLabel).not.toBeNull();

    // Check if buttons are rendered
    const undoButton = screen.getByText('Undo');
    const resetButton = screen.getByText('Reset');
    const config1Button = screen.getByText('Config 1');
    const config2Button = screen.getByText('Config 2');
    const config3Button = screen.getByText('Config 3');

    expect(undoButton).not.toBeNull();
    expect(resetButton).not.toBeNull();
    expect(config1Button).not.toBeNull();
    expect(config2Button).not.toBeNull();
    expect(config3Button).not.toBeNull();
  });
  
  // Test for reset button functionality
  it('resets the game when Reset button is clicked', () => {
    render(<Home />);

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    // After reset, the moves should be reset to 0
    const movesLabel = screen.getByText(/Moves: 0/);
    expect(movesLabel).not.toBeNull();
  });

  // Test for changing configurations
  it('changes configuration when Config 1, 2, or 3 is clicked', () => {
    render(<Home />);

    const config1Button = screen.getByText('Config 1');
    const config2Button = screen.getByText('Config 2');
    const config3Button = screen.getByText('Config 3');

    // Initially, Config 1 should be active
    expect(config1Button.classList.contains('bg-orange-500')).toBe(true);

    // Click Config 2 and check if the class changes
    fireEvent.click(config2Button);
    expect(config2Button.classList.contains('bg-orange-500')).toBe(true); // Config 2 should now be active
    expect(config1Button.classList.contains('bg-orange-500')).toBe(false); // Config 1 should no longer be active

    // Click Config 3 and verify the class change
    fireEvent.click(config3Button);
    expect(config3Button.classList.contains('bg-orange-500')).toBe(true); // Config 3 should now be active
    expect(config2Button.classList.contains('bg-orange-500')).toBe(false); // Config 2 should no longer be active
  });

  // Modify the 'handles canvas click events and updates state' test
  it('handles canvas click events and updates state', async () => {
    render(<Home />);
    
    const canvasElement = screen.getByTestId('puzzle-canvas');
    
    fireEvent.click(canvasElement, { clientX: 52.34375, clientY: 52 }); 
    fireEvent.click(canvasElement, { clientX: 159.34375, clientY: 50 });

    // Wait for the state to update
    await waitFor(() => {
      const movesLabel = screen.getByText(/Moves: 1/); // Check the updated move count
      expect(movesLabel).not.toBeNull();
    });
  });

  // Test for score update after a valid swap
  it('updates the score correctly after a swap', async () => { // Add async here
    render(<Home />);

    const canvas = screen.getByTestId('puzzle-canvas');
    
    // Simulate a valid swap
    fireEvent.click(canvas, { clientX: 163.34375, clientY: 146 }); 
    fireEvent.click(canvas, { clientX: 41.34375, clientY: 357 }); 

    // Score should be updated (this depends on your game logic)
    await waitFor(() => { // Add await here
      const scoreLabel = screen.getByText(/Score: 2/); // Assuming a score update logic
      expect(scoreLabel).not.toBeNull();
    });
  });


  it('handles undo functionality', async () => {
    render(<Home />);
    
    const undoButton = screen.getByText('Undo');
    const canvasElement = screen.getByTestId('puzzle-canvas');
    
    // Simulate two valid canvas clicks to trigger a move
    fireEvent.click(canvasElement, { clientX: 52.34375, clientY: 52 }); // Click first syllable
    fireEvent.click(canvasElement, { clientX: 159.34375, clientY: 50 }); // Click second syllable

    // Log after canvas clicks to confirm clicks are being registered
    console.log("Canvas clicked for move");

    // Wait for the move to register
    const movesLabel = await waitFor(() => screen.findByText(/Moves: 1/));
    expect(movesLabel).not.toBeNull(); // Using not.toBeNull() instead of toBeInTheDocument

    // Click the undo button and wait for moves to reset
    fireEvent.click(undoButton);

    // Log after undo click to confirm undo action
    console.log("Undo button clicked");

    // Wait for the move count to revert back to 0 after undo
    const movesLabelAfterUndo = await waitFor(() => screen.findByText(/Moves: 0/));
    expect(movesLabelAfterUndo).not.toBeNull(); // Using not.toBeNull() instead of toBeInTheDocument
  });

    // Test for game completion message
  it('displays the completion message when the game is completed', async () => {
    render(<Home />);

    const canvas = screen.getByTestId('puzzle-canvas');
    
    // Simulate moves that complete the puzzle (you can simulate exact moves or mock the completion)
    fireEvent.click(canvas, { clientX: 163.34375, clientY: 146 }); 
    fireEvent.click(canvas, { clientX: 24.34375, clientY: 353 }); 

    fireEvent.click(canvas, { clientX: 38.34375, clientY: 231 }); 
    fireEvent.click(canvas, { clientX: 254.34375, clientY: 354 }); 

    fireEvent.click(canvas, { clientX: 238.34375, clientY: 66 }); 
    fireEvent.click(canvas, { clientX: 347.34375, clientY: 368 }); 

    fireEvent.click(canvas, { clientX: 43.34375, clientY: 151 }); 
    fireEvent.click(canvas, { clientX: 160.34375, clientY: 248 }); 

    fireEvent.click(canvas, { clientX: 361.34375, clientY: 136 }); 
    fireEvent.click(canvas, { clientX: 240.34375, clientY: 247 }); 

    fireEvent.click(canvas, { clientX: 130.34375, clientY: 52 }); 
    fireEvent.click(canvas, { clientX: 356.34375, clientY: 256 }); 

    fireEvent.click(canvas, { clientX: 152.34375, clientY: 50 }); 
    fireEvent.click(canvas, { clientX: 18.34375, clientY: 40 }); 

    fireEvent.click(canvas, { clientX: 334.34375, clientY: 34 }); 
    fireEvent.click(canvas, { clientX: 148.34375, clientY: 48 }); 

    fireEvent.click(canvas, { clientX: 262.34375, clientY: 152 }); 
    fireEvent.click(canvas, { clientX: 35.34375, clientY: 144 }); 

    fireEvent.click(canvas, { clientX: 335.34375, clientY: 156 }); 
    fireEvent.click(canvas, { clientX: 168.34375, clientY: 148 }); 

    fireEvent.click(canvas, { clientX: 358.34375, clientY: 159 }); 
    fireEvent.click(canvas, { clientX: 268.34375, clientY: 151 });

    // Ensure that the completion message is displayed
    const completionMessage = await screen.findByText(/Congratulations! You completed the puzzle!/i);
    expect(completionMessage).not.toBeNull();
  });

  // Test for selecting and deselecting the same syllable
it('deselects the syllable when clicking the same one twice', () => {
  render(<Home />);

  const canvas = screen.getByTestId('puzzle-canvas');
  
  // Simulate selecting the same syllable twice
  fireEvent.click(canvas, { clientX: 358.34375, clientY: 159 }); 
  fireEvent.click(canvas, { clientX: 358.34375, clientY: 159 }); 

  // Moves should remain 0, as no swap happens
  const movesLabel = screen.getByText(/Moves: 0/);
  expect(movesLabel).not.toBeNull();
});

it('does not allow clicks when the game is completed', async () => {
  render(<Home />);

  const canvas = screen.getByTestId('puzzle-canvas');

  // Simulate completing the game
  fireEvent.click(screen.getByText('Config 1')); // Assume completing the puzzle based on a configuration reset

  // Now simulate trying to click after game completion
  fireEvent.click(canvas, { clientX: 52, clientY: 52 }); // Try to click after the game is completed

  // Ensure that no moves are registered
  await waitFor(() => {
    const movesLabel = screen.getByText(/Moves: 0/); // No moves should happen after game completion
    expect(movesLabel).not.toBeNull();
  });
});

});



  
  
