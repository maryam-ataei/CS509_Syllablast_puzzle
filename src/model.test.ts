import { expect, test } from 'vitest';
import { SyllablastModel } from './model';

// Test for swapping syllables and undoing
test('Syllable swapping and undo functionality', () => {
  let model = new SyllablastModel(1);  // Configuration 1 for the test

  // Initial positions
  let initialSyllable = model.board.grid[0][0];  // 'ter'
  let targetSyllable = model.board.grid[0][1];   // 'ate'

  // Swap syllables at positions (0, 0) and (0, 1)
  model.swap([0, 0], [0, 1]);

  // Check if the swap happened
  expect(model.board.grid[0][0]).toBe(targetSyllable);  // Should now be 'ate'
  expect(model.board.grid[0][1]).toBe(initialSyllable); // Should now be 'ter'
  expect(model.swaps).toBe(1);

  // Undo the last swap
  model.undo();

  // Check if undo worked
  expect(model.board.grid[0][0]).toBe(initialSyllable); // Should be back to 'ter'
  expect(model.board.grid[0][1]).toBe(targetSyllable);  // Should be back to 'ate'
  expect(model.swaps).toBe(0);
});

// Test for score calculation
test('Score calculation based on correct syllables', () => {
  let model = new SyllablastModel(1);  // Configuration 1

  // Initial score should be 0
  expect(model.score).toBe(0);

  // Perform a swap
  model.swap([1, 2], [3, 0]);

  // Calculate and assert score after swap
  expect(model.score).toBe(1);
});

// Test for puzzle completion
test('Puzzle completion detection', () => {
  let model = new SyllablastModel(1);  // Configuration 1

  // Adjust grid to reflect a completed puzzle
  model.board.grid = [
    ['af', 'fil', 'i', 'ate'],  // affiliate
    ['im', 'mac', 'u', 'late'], // immaculate
    ['in', 'vis', 'i', 'ble'],  // invisible
    ['un', 'der', 'wa', 'ter'], // underwater
  ];

  // Check if the puzzle is completed
  model.updateScore();
  expect(model.isGameCompleted).toBe(true);  // Game should be marked as completed
});

// Test resetting the board
test('Resetting the puzzle board', () => {
  let model = new SyllablastModel(1);  // Configuration 1

  // Make some changes to the board
  model.swap([0, 0], [0, 1]);
  expect(model.swaps).toBe(1);

  // Reset the board
  model.reset();
  
  // Ensure the board and game state is back to the original
  expect(model.swaps).toBe(0);
  expect(model.score).toBe(0);
  expect(model.isGameCompleted).toBe(false);
  expect(model.board.grid[0][0]).toBe('ter');  // Original configuration
  expect(model.board.grid[0][1]).toBe('ate');  // Original configuration
});

// Test for constructor with different configurations
test('Model initializes with different configurations', () => {
  let model1 = new SyllablastModel(1);
  expect(model1.board.grid).toEqual([
    ['ter', 'ate', 'ble', 'der'],
    ['fil', 'in', 'im', 'i'],
    ['i', 'late', 'mac', 'un'],
    ['u', 'vis', 'af', 'wa']
  ]);

  let model2 = new SyllablastModel(2);
  expect(model2.board.grid).toEqual([
    ['force', 'ment', 'al', 'in'],
    ['for', 'ma', 'am', 'in'],
    ['tive', 'ma', 'ing', 'in'],
    ['ri', 're', 'te', 'ex']
  ]);

  let model3 = new SyllablastModel(3);
  expect(model3.board.grid).toEqual([
    ['al', 'di', 'me', 'di'],
    ['cu', 'cal', 'cal', 'me'],
    ['lat', 'im', 'ing', 'i'],
    ['on', 'ate', 'ag', 'chan']
  ]);
});

// Test for no swap after game completion
test('No swap allowed if game is completed', () => {
  let model = new SyllablastModel(1);
  
  // Complete the puzzle
  model.board.grid = [
    ['af', 'fil', 'i', 'ate'],
    ['im', 'mac', 'u', 'late'],
    ['in', 'vis', 'i', 'ble'],
    ['un', 'der', 'wa', 'ter'],
  ];
  model.updateScore();
  expect(model.isGameCompleted).toBe(true);

  // Try to swap after game completion
  model.swap([0, 0], [0, 1]);
  expect(model.swaps).toBe(0); // Swap shouldn't happen
});

// Test for no undo if no swap history
test('No undo allowed if there is no swap history', () => {
  let model = new SyllablastModel(1);

  // Try to undo without any swaps
  model.undo();
  expect(model.swaps).toBe(0); // Undo shouldn't happen
});

// Test for score update without completing the game
test('Score update does not complete game if puzzle is incomplete', () => {
  let model = new SyllablastModel(1);

  // Puzzle is not completed
  model.board.grid = [
    ['af', 'fil', 'i', 'ate'],
    ['im', 'mac', 'u', 'late'],
    ['in', 'mis', 'i', 'ble'],  // One incorrect word
    ['un', 'der', 'wa', 'ter'],
  ];

  model.updateScore();
  expect(model.isGameCompleted).toBe(false); // Game should not be marked as completed
});

// Test for random syllable swap without game completion
test('Random swap does not complete the game prematurely', () => {
  let model = new SyllablastModel(1);

  // Perform a random swap
  model.swap([0, 0], [3, 3]);

  expect(model.isGameCompleted).toBe(false); // Game should not be completed
  expect(model.swaps).toBe(1);
});

// Test for resetting after multiple swaps
test('Resetting the puzzle board after multiple swaps', () => {
  let model = new SyllablastModel(1);

  // Perform multiple swaps
  model.swap([0, 0], [0, 1]);
  model.swap([1, 0], [1, 1]);
  expect(model.swaps).toBe(2);

  // Reset the board
  model.reset();

  // Ensure everything is reset correctly
  expect(model.swaps).toBe(0);
  expect(model.score).toBe(0);
  expect(model.isGameCompleted).toBe(false);
  expect(model.board.grid[0][0]).toBe('ter'); // Original config
  expect(model.board.grid[0][1]).toBe('ate');
});
