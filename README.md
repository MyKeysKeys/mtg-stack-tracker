# Magic: The Gathering Stack Tracker

## Project Overview

The Magic: The Gathering Stack Tracker is a web application designed to help players visualize and manage the Stack in the card game Magic: The Gathering. The Stack is the game zone where spells and abilities are placed when they are played and where they wait to resolve.

## Purpose and Goals

The primary goal of this application is to provide a user-friendly interface for tracking the Stack during games. Players can easily see what spells and abilities are currently waiting to resolve, enhancing their gameplay experience.

## Features

- **Card Search**: Search for Magic cards using the Scryfall API.
- **Stack Visualization**: Visually represent the Stack with card images and relevant information.
- **Stack Controls**: Manage the Stack with options to add, remove, or clear cards.
- **Card Visualizer**: Display a larger version of the selected card with detailed information.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd mtg-stack-tracker
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

## Project Structure

```
mtg-stack-tracker
├── public
├── src
│   ├── components
│   │   ├── CardVisualizer
│   │   ├── Controls
│   │   ├── Search
│   │   ├── SearchResults
│   │   └── Stack
│   ├── services
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.