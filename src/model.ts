// model.ts
import { PuzzleBoard } from './PuzzleBoard';

export class SyllablastModel {
  public board: PuzzleBoard;
  public score: number;
  public swaps: number;
  public history: Array<{ from: [number, number]; to: [number, number] }>;
  public currentConfig: number;
  private configurations: Record<number, string[][]>;
  private originalWords: Record<number, string[][]>;
  public isGameCompleted: boolean; // Flag to track game completion

  constructor(configuration: number = 1) {
    // Define configurations for the board setup
    this.configurations = {
      1: [ 
        ['ter','ate','ble','der'],
        ['fil','in','im','i'],
        ['i','late','mac','un'],
        ['u','vis','af','wa']
        ],
      2: [
          ['force','ment','al','in'],
          ['for','ma','am','in'],
          ['tive','ma','ing','in'],
          ['ri','re','te','ex']
         ],
      3: [
        ['al','di','me','di'],
        ['cu','cal','cal','me'],
        ['lat','im','ing','i'],
        ['on','ate','ag','chan']
      ],
    };

    // Define the original words for each configuration for scoring
    this.originalWords = {
      1: [
        ['af', 'fil', 'i', 'ate'], // affiliate
        ['im', 'mac', 'u', 'late'], // immaculate
        ['in', 'vis', 'i', 'ble'], // invisible
        ['un', 'der', 'wa', 'ter'], // underwater
      ],
      2: [
        ['ex', 'am', 'in', 'ing'], // examining
        ['re', 'in', 'force', 'ment'], // reinforcement
        ['in', 'for', 'ma', 'tive'], // informative
        ['ma', 'te', 'ri', 'al'], // material
      ],
      3: [
        ['me', 'chan', 'i', 'cal'], // mechanical
        ['cal', 'cu', 'lat', 'ing'], // calculating
        ['im', 'me', 'di', 'ate'], // immediate
        ['di', 'ag', 'on', 'al'], // diagonal
      ],
    };

    this.currentConfig = configuration;
    this.board = new PuzzleBoard(
      this.configurations[configuration],
      this.originalWords[configuration]
    );
    this.score = 0;
    this.swaps = 0;
    this.history = [];
    this.isGameCompleted = false; // Initialize completion flag
  }

  // Reset the game to the initial state with the current configuration
  reset() {
    this.board.reset();
    this.score = 0;
    this.swaps = 0;
    this.history = [];
    this.isGameCompleted = false; // Reset completion flag
    this.updateScore(); // Ensure score is recalculated after reset
  }

  // Update the score based on the current board state
  updateScore() {
    this.score = this.board.calculateScore(); // Calculate the score dynamically based on the current state
    this.isGameCompleted = this.board.isCompleted(); // Set the completion flag if all words are correct
  }

  // Swap two positions on the board
  swap(pos1: [number, number], pos2: [number, number]) {
    // Prevent swaps if the game is completed
    if (this.isGameCompleted) {
      return; // Do nothing if the game is completed
    }

    this.board.swap(pos1, pos2); // Swap the syllables
    this.swaps += 1; // Ensure swap count is always correct
    this.history.push({ from: pos1, to: pos2 }); // Track the swap in history
    this.updateScore(); // Update score to reflect the impact of the swap
  }

  // Undo the last swap
  undo() {
    if (this.isGameCompleted || this.history.length === 0) {
      return; // Do nothing if the game is completed or there's no history to undo
    }

    const lastMove = this.history.pop(); // Get the last move
    if (lastMove) {
      this.board.swap(lastMove.to, lastMove.from); // Reverse the last swap
      this.swaps -= 1; // Decrement the swap count
      this.updateScore(); // Recalculate score after undoing the swap
    }
  }
}
