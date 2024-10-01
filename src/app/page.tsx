'use client';
import React, { useEffect, useRef, useState } from 'react';
import { SyllablastModel } from '../model'; // Import your existing Model
import { redrawCanvas } from '../boundary'; // Import redrawCanvas from boundary.ts

export default function Home() {
  const [model, setModel] = useState(new SyllablastModel(1)); // Initialize with configuration 1
  const [board, setBoard] = useState(model.board.grid);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [swaps, setSwaps] = useState(model.swaps); // State for number of swaps
  const [score, setScore] = useState(model.score); // State for the score
  const [completed, setCompleted] = useState(model.isGameCompleted); // State to track game completion
  const [correctPositions, setCorrectPositions] = useState<boolean[][]>([]); // State to track correct positions
  const [currentConfig, setCurrentConfig] = useState(1); // State to track the current config

  // Ref for the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setBoard([...model.board.grid]); // Update state with the latest board configuration
    setCompleted(model.isGameCompleted); // Update the completed state
    setCorrectPositions(model.board.getCorrectPositions()); // Update correct positions
  }, [model]);

  useEffect(() => {
    if (canvasRef.current) {
      redrawCanvas(model, canvasRef.current, selected, setSelected, swap); // Pass selected state and swap function
    }
  }, [board, selected, correctPositions, model]);

  const swap = (pos1: [number, number], pos2: [number, number]) => {
    if (completed) return; // Prevent swaps if the game is completed
    if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) return; // Prevent move if clicking the same syllable
    console.log(`Swapping: ${pos1} with ${pos2}`); // Add this line
    model.swap(pos1, pos2);
    setSwaps(model.swaps); // Update swaps state
    setScore(model.score); // Update score state to reflect changes, whether increase or decrease
    setBoard([...model.board.grid]); // Update the board state
    setCompleted(model.isGameCompleted); // Check if the game is completed after the swap
    setCorrectPositions(model.board.getCorrectPositions()); // Update correct positions
  };

  const reset = () => {
    model.reset();
    setSwaps(model.swaps); // Reset swaps state
    setScore(model.score); // Reset score state
    setBoard([...model.board.grid]); // Reset board state
    setCompleted(false); // Reset the completed state
    setCorrectPositions([]); // Reset correct positions
  };

  const handleClick = (row: number, col: number) => {
    if (completed) return; // Prevent clicks if the game is completed
    if (selected) {
      if (selected[0] === row && selected[1] === col) {
        setSelected(null); // Deselect if the same cell is clicked again
        return;
      }
      swap(selected, [row, col]); // Swap if another syllable is already selected
      setSelected(null);
    } else {
      setSelected([row, col]); // Select syllable
    }
  };

  const undo = () => {
    if (completed || model.history.length === 0) return; // Prevent undo if the game is completed
    const lastMove = model.history.pop()!;
    model.board.swap(lastMove.to, lastMove.from);
    model.swaps -= 1;
    model.updateScore();
    setSwaps(model.swaps); // Update swaps state
    setScore(model.score); // Update score state
    setBoard([...model.board.grid]);
    setCompleted(model.isGameCompleted); // Check if the game is completed after undo
    setCorrectPositions(model.board.getCorrectPositions()); // Update correct positions
  };

  const chooseConfiguration = (config: number) => {
    const newModel = new SyllablastModel(config); // Create a new instance of the model with the chosen configuration
    setModel(newModel); // Update the model state
    setCurrentConfig(config); // Update the current config state
    setSwaps(newModel.swaps); // Reset swaps state
    setScore(newModel.score); // Reset score state
    setBoard([...newModel.board.grid]); // Reset board state
    setCompleted(false); // Reset the completed state
    setCorrectPositions([]); // Reset correct positions
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold">Moves: {swaps}</p>
          <p className="text-xl font-bold">Score: {score}</p>
          {completed && (
            <p className="text-xl font-bold text-green-600">
              Congratulations! You completed the puzzle!
            </p>
          )}
        </div>

        {/* Canvas element for rendering the board */}
        <canvas
          ref={canvasRef}
          width={400} // Adjust as needed for your game size
          height={400} // Adjust as needed for your game size
          className="border border-gray-300 shadow-lg"
          data-testid="puzzle-canvas" // Add this line
        />

        <div className="flex gap-4">
          <button
            onClick={undo}
            className="p-2 bg-gray-200"
            disabled={completed}
          >
            Undo
          </button>
          <button onClick={reset} className="p-2 bg-gray-200">
            Reset
          </button>
          <button
            onClick={() => chooseConfiguration(1)}
            className={`p-2 ${currentConfig === 1 ? 'bg-orange-500' : 'bg-gray-200'} `}
          >
            Config 1
          </button>
          <button
            onClick={() => chooseConfiguration(2)}
            className={`p-2 ${currentConfig === 2 ? 'bg-orange-500' : 'bg-gray-200'} `}
          >
            Config 2
          </button>
          <button
            onClick={() => chooseConfiguration(3)}
            className={`p-2 ${currentConfig === 3 ? 'bg-orange-500' : 'bg-gray-200'} `}
          >
            Config 3
          </button>
        </div>
      </main>
    </div>
  );
}
