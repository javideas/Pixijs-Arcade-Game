![PixiJs Arcade Logo](./Arcade_Logo.png)

## Index

1. [Project Description](#project-description)
2. [Key Features](#key-features)
3. [Bonus Features](#bonus-features)
4. [How to Play](#how-to-play)
5. [Game Controls](#game-controls)
6. [Technologies Used](#technologies-used)
7. [How to Install](#how-to-install)

# PixiJs Arcade Game

## Project Description:
A classic arcade-style vertical scrolling game built with PixiJS and TypeScript inspired by [1943: The Battle of Midway](https://www.youtube.com/watch?v=FbUN5ITWQQo). In my version, the player controls a hero character, a spaceship, moving upwards through an endless scrolling space, dodging or destroying enemies and obstacles. The objective is to survive as long as possible while accumulating points by defeating enemies and avoiding crashes.

## Key Features:
- **Endless Vertical Scrolling**: The game world scrolls continuously from top to bottom, giving the illusion that the player is moving upward through a dynamic environment.
- **Player Movement**: The hero can move in all four directions using keyboard arrows, with fluid control that allows dodging obstacles and navigating through enemies.
- **Projectiles & Combat**: The player can shoot projectiles to destroy enemies and obstacles. The game features multiple types of enemies with varying behaviors.
- **Enemy AI**: Randomly generated enemies that move downward, shoot projectiles. (TODO: attempt to collide with the player).
- **Obstacle System**: Randomly generated obstacles that move downwards. These can either be dodged or destroyed using the player’s projectiles.
- **Health & Lives**: The player has a health system, losing health when hit by enemies or obstacles. The game ends when the player's health reaches zero.
- **Score Tracking**: Players earn points by destroying enemies and surviving longer. The score is displayed on the game screen.
- **Game Over & High Score**: A high score system stores the player’s best performance locally and updates when beaten.

## Bonus Features:
- **Multiple Weapons**: The hero can switch between different types of weapons, such as rapid-fire projectiles and bombs.
- **Parallax Scrolling Backgrounds**: Multiple layers of backgrounds move at different speeds to create a sense of depth and immersion.
- **Explosions and Visual Effects**: When enemies or obstacles are destroyed, explosion animations and particle effects enhance the gameplay experience.
- **Menu System**: A basic home screen with options to start the game, view high scores, and access settings.

## How to Play:
1. **Movement**: Use the arrow keys to move the hero in any direction.
2. **Shooting**: Press the space bar to fire projectiles at enemies and obstacles.
3. **Objective**: Survive as long as possible by dodging obstacles and defeating enemies.
4. **Scoring**: Points are awarded for every enemy destroyed and for surviving longer.

## Game Controls:
- **Arrow Keys**: Move the player character.
- **Space Bar**: Fire projectiles.
- **Esc**: Pause the game or return to the main menu.

## Technologies Used:
- **PixiJS**: For rendering the 2D game world.
- **TypeScript**: For writing clean, maintainable code.
- **HTML5 & CSS3**: For structuring the game’s interface.
- **Vite**: For fast bundling and local development.
- **Electron**: For building the game into a desktop application.

## How to Install

To get started with this project, follow these steps:

1. **Clone the Repository**:  
   First, clone the repository to your local machine using the following command:

   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**:  
   Navigate to the project directory and install the necessary dependencies using npm:

   ```bash
   cd <project-directory>
   npm install (or just "npm i")
   ```

   This command will install all the required packages listed in the `package.json` file.

3. **Run the Project**:  
   You can run the project in different modes depending on your needs:

   - **Development Mode**:  
     To start the development server, use:

     ```bash
     npm run dev
     ```

     This will start the Vite development server.

   - **Electron Development**:  
     To run the Electron app in development mode, use:

     ```bash
     npm run dev:electron
     ```

   - **Build the Project**:  
     To build the project for production, use:

     ```bash
     npm run build
     ```

   - **Preview the Build**:  
     To preview the production build, use:

     ```bash
     npm run preview
     ```

   - **Start the Electron App**:  
     To start the Electron app, use:

     ```bash
     npm start
     ```

   - **Build for Electron**:  
     To build the Electron app, use:

     ```bash
     npm run build:electron
     ```

   - **Distribute for Specific Platforms**:  
     To create distribution packages for different platforms, use the following commands:

     - **macOS**:  
       ```bash
       npm run dist:mac
       ```

     - **Windows**:  
       ```bash
       npm run dist:win
       ```

     - **Linux**:  
       ```bash
       npm run dist:linux
       ```

   These commands will transpile the Electron code, build the project, and package it for the specified platform.

By following these steps, you should be able to set up and run the project on your local machine. If you encounter any issues, please refer to the project's documentation or reach out for support.