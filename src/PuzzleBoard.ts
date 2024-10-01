// PuzzleBoard.ts
export class PuzzleBoard {
  public grid: string[][];
  private initialGrid: string[][];
  private originalWords: string[][];
  public lastSwapped: { from: [number, number] | null; to: [number, number] | null }; // Add this line to track last swapped positions

  constructor(initialGrid: string[][], originalWords: string[][]) {
    this.grid = initialGrid.map((row) => [...row]); // Copy to avoid mutating the original reference
    this.initialGrid = initialGrid.map((row) => [...row]); // Store a copy of the initial grid for resets
    this.originalWords = originalWords; // Words to check for scoring
    this.lastSwapped = { from: null, to: null }; // Initialize lastSwapped
  }

  // Reset the grid to the initial configuration
  reset() {
    this.grid = this.initialGrid.map((row) => [...row]); // Reset to initial state
    this.lastSwapped = { from: null, to: null }; // Reset lastSwapped
  }

  getCorrectPositions(): boolean[][] {
    const correctPositions = this.grid.map((row) => row.map(() => false)); // Initialize correct positions grid
    const lockedRows = new Set<number>(); // To store rows that form valid sequences and should remain marked
  
    // Step 1: Iterate through rows and check syllable sequences
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      const currentRow = this.grid[rowIndex];
  
      this.originalWords.forEach((word) => {
        const firstSyllable = word[0];
  
        // Check each syllable in the row against the word
        if (currentRow[0] === firstSyllable) {
          let isValid = true;
          let matchedLength = 0; // Track how many syllables match
  
          // Check each syllable in the row against the word
          for (let i = 0; i < word.length && i < currentRow.length; i++) {
            if (currentRow[i] !== word[i]) {
              isValid = false;
              break;
            } else {
              matchedLength++; // Count how many syllables match
            }
          }
  
          // If the row matches partially or fully, mark the valid syllables and lock the row
          if (isValid || matchedLength > 0) {
            for (let i = 0; i < matchedLength; i++) {
              correctPositions[rowIndex][i] = true; // Mark as correct
            }
            lockedRows.add(rowIndex); // Lock the row
          }
        }
      });
    }
  
    // Step 2: Clean up invalid or incomplete rows that do not match a valid word
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      if (!lockedRows.has(rowIndex)) {
        correctPositions[rowIndex].fill(false); // Unmark incomplete or incorrect rows
      }
    }
  
    return correctPositions;
  }
  
  // Calculate score 
  calculateScore(): number {
    const correctPositions = this.getCorrectPositions();
    let score = 0;
    correctPositions.forEach((row) => {
      row.forEach((isCorrect) => {
        if (isCorrect) score++;
      });
    });
    return score;
  }

  // Check if all words are completely matched
  isCompleted(): boolean {
    return this.originalWords.every((word) => {
      const correctRow = this.grid.find(row => {
        return row.every((syllable, index) => syllable === word[index]);
      });
      return !!correctRow; // Return true if there's a fully matched row for this word
    });
  }


  // Method to swap two syllables and track the swap
  swap(pos1: [number, number], pos2: [number, number]) {
    console.log(`Swapping: ${pos1} with ${pos2}`); // Log the positions being swapped
    const [r1, c1] = pos1;
    const [r2, c2] = pos2;
    [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
    this.lastSwapped = { from: pos1, to: pos2 };
  }
}
