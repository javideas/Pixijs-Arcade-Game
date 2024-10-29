![image](https://github.com/user-attachments/assets/9a3139e8-5266-4741-bb3e-2575e1494796)

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
A classic arcade-style vertical scrolling game built with PixiJS and TypeScript inspired by [1943: The Battle of Midway](https://www.youtube.com/watch?v=FbUN5ITWQQo). In my version, the player controls a spaceship, the hero character, moving upwards through an endless scrolling space, dodging or destroying enemies and obstacles. The objective is to survive as long as possible while accumulating points by defeating enemies and avoiding crashes.

## Key Features:
- **Endless Vertical Scrolling**: The game world scrolls continuously from top to bottom, giving the illusion that the player is moving upward through a dynamic environment.
- **Player Movement**: The hero can move in all four directions using keyboard arrows (and WASD), with fluid control that allows dodging obstacles and navigating through enemies.
- **Projectiles & Combat**: The player can shoot projectiles (using SPACE key) to destroy enemies and obstacles. The game features multiple types of enemies with varying behaviors.
- **Enemy AI**: Randomly generated enemies that move downward, shoot projectiles. (TODO: ai to attempt to collide with the player).
- **Obstacle System**: Randomly generated obstacles that move downwards (an Asteroid). These can either be dodged or destroyed using the player’s projectiles.
- **Health & Lives**: The player has a health system, losing health when hit by enemies or obstacles. The game ends when the player's health reaches zero.
- **Score Tracking**: Players score is displayed on the game screen as "Light years" traveled.
- **Game Over & High Score**: TODO: A high score system stores the player’s best performance locally and updates when beaten.

## Bonus Features:
- **Multiple Weapons**: Currently there are 2 types of weapons: shooting 2 or 3 projectiles.
- **Explosions and Visual Effects**: When enemies or obstacles are destroyed, explosion animations and particle effects enhance the gameplay experience.
- **Shield**: An energy shield protect the player. For now, it can be unlocked using "i" key. TODO: is triggered by collecting pickups on the way and it deactivates after some time.
- **Menu System**: TODO: A basic home screen with options to start the game, view high scores, and access settings.
- **Live Demo**: TODO: work in progress.
- **Responsiveness**: game is responsive. TODO: red and blue tabs will have info regarding high scores, settings or a input guide. In phone will be touchable.

  ![image](https://github.com/user-attachments/assets/0bff56b6-73c5-4e11-ba61-5cc8a0d7346f)


## How to Play:
1. **Movement**: Use the arrow keys or WASD to move the hero in any direction.
2. **Shooting**: Press the space bar to fire projectiles at enemies and obstacles.
3. **Objective**: Survive as long as possible by dodging obstacles and defeating enemies.
4. **Scoring**: "Light years" are "awarded" for surviving longer.

## Game Controls:
- **Arrow Keys**: Move the player character.
- **Space Bar**: Fire projectiles.
- **i**: Trigger energy shield for protection/debugging.
- **b**: Debug Collision Boxes.

## Technologies Used:
- **PixiJS**: For rendering the 2D game world. I made used of several effects to achieve the old retro arcade vibe.
- **GSAP**: To simulate ai behaviour dynamically.
- **TypeScript**: For writing clean, maintainable code.
- **HTML5 & CSS3**: For structuring the game’s interface.
- **Vite**: For fast bundling and local development.
- **Electron**: TODO: For building the game into a desktop application.

## Task management in Trello
  ![image](https://github.com/user-attachments/assets/cbe8a9a2-c160-4304-bc2a-53c7413794ae)

## Adapting sprite assets for better fitting
These explosions sprites, in the last frame, are so scattered that TexturePackerGUI understands each piece like a different sprite, so I had to fix it in photopea.com (a free alternative to photoshop) to give some background with very little opacity.
![image](https://github.com/user-attachments/assets/83c2d35e-03dc-416b-bea4-522f1d71d43e)
![image](https://github.com/user-attachments/assets/aa161a00-f943-42dd-9d59-0a20ea5b67c7)
![image](https://github.com/user-attachments/assets/c3f3592e-5ecf-4b2f-ad0f-73629e6d8977)

Sprites authors will be clarified in this area soon.

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

   - **Development Mode**:  <----------------What you need "to play the game".
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
