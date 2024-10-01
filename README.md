# Syllablast Puzzle Game

## Overview

Syllablast is a solitaire puzzle game where players rearrange syllables in a 4x4 grid to recreate the original words from which they were disassembled. The objective is to swap syllables strategically to form the correct words, with the number of swaps and the score calculated based on consecutive syllables in each row.

## Features

- **Swap Syllables**: Players can swap two syllables on the board.
- **Score System**: The score is based on the number of consecutive syllables in each row that form part of an original word.
- **Undo**: Players can undo the most recent swap.
- **Reset**: Players can reset the puzzle to its initial state, resetting both the board and score.
- **Configuration Options**: Three initial board configurations to choose from.
- **Puzzle Completion**: When a puzzle is solved, no more swaps can be made, and a congratulatory message is displayed.

## Initial Configurations

1. **Configuration 1**:  
   - Words: `in,vis,i,ble`, `im,mac,u,late`, `af,fil,i,ate`, `un,der,wa,ter`
   
2. **Configuration 2**:  
   - Words: `ex,am,in,ing`, `re,in,force,ment`, `in,for,ma,tive`, `ma,te,ri,al`

3. **Configuration 3**:  
   - Words: `me,chan,i,cal`, `cal,cu,lat,ing`, `im,me,di,ate`, `di,ag,on,al`

## Installation

1. **Node.js Installation**  
   Ensure you have Node.js version `18.20.4` installed. You can download it from [Node.js official website](https://nodejs.org/en/download/package-manager).

   To check if Node.js is installed:
   ```bash
   node -v
2. **TypeScript Installation**

    Install TypeScript globally using npm by running the following command:

    ```bash
    npm install -g typescript

3. **Next.js Installation**

    Create a new Next.js application using the following commands:

    ```bash
    npx create-next-app@latest
      ```
    
Once created, install the latest versions of Next.js, React, and React DOM:

    ```bash
    npm install next@latest react@latest react-dom@latest
      ```

4. **Install Testing Libraries**

    To set up the testing environment with Vitest and related libraries, run:
    
    ```bash
    npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom 

Installing canvas
If you have a Canvas element into which you are drawing, then for testing you need to install a special
canvas module.
    ```bash
    npm install canvas
    
Note that this is only required if you have Canvas.

5. **Configure Vitest**

    In your package.json, add the following script entries:
    
    ```bash
    "scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest"
}

Create a vitest.config.ts file in the root directory of your project and add the following configuration:

    ```bash
    import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});

##Running the Application

Start the development server

    ```bash
    npm run dev

Build the project for production
    
    ```bash
    npm run build

Run the tests
    ```bash
    npm run test -- --coverage


##Gameplay Instructions
1. Choose one of the three configurations.
2. Swap syllables by clicking two syllables on the board.
3. The score updates based on the number of correct consecutive syllables starting from the first column in each row.
4. Use the undo option to revert the last swap or reset the puzzle to start over.
5. Complete the puzzle by correctly aligning all the syllables to form the original words.


