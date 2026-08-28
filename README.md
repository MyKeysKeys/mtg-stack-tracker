# Magic: The Gathering Stack Tracker

**🔗 [Live Demo](https://mykeyskeys.github.io/mtg-stack-tracker/)**

## Project Overview

The Magic: The Gathering Stack Tracker is a web application designed to help players visualize and manage the Stack in the card game Magic: The Gathering. The Stack is the game zone where spells and abilities are placed when they are played and where they wait to resolve.

### What is "The Stack"?

In Magic: The Gathering, when a player casts a spell or activates an ability, it goes on "the Stack." Players can respond to spells on the Stack with their own spells or abilities, which also go on the Stack. The Stack resolves in **last in, first out (LIFO)** order—like a stack data structure. This application provides a visual way to track which spells and abilities are waiting to resolve.

## Purpose and Goals

The primary goal of this application is to provide a user-friendly interface for tracking the Stack during games. Players can easily see what spells and abilities are currently waiting to resolve, enhancing their gameplay experience.

## Features

- **Card Search**: Search for Magic cards using the Scryfall API.
- **Stack Visualization**: Visually represent the Stack with card images and relevant information.
- **Stack Controls**: Manage the Stack with options to add, remove, or clear cards.
- **Card Visualizer**: Display a larger version of the selected card with detailed information.
- **Drag & Drop Reordering**: Reorder cards on the Stack with intuitive drag-and-drop.

## Technologies Used

- **React 18** — Frontend framework
- **Vite** — Fast build tool and development server
- **Scryfall API** — Card data and images
- **CSS3** — Styling and animations

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd mtg-stack-tracker
   ```
3. Install dependencies (requires Node.js and npm):
   ```
   npm install
   ```

### Running the Application

Start the development server:
```
npm start
```
The application will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! When opening an issue, choose the matching template for a bug report or enhancement request and include the requested details. This helps contributors reproduce problems, discuss ideas, and test improvements consistently.

Pull requests should explain what changed and how it was tested.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.