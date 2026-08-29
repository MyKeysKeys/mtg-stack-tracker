import { useEffect, useRef, useState } from 'react';
import Search from './components/Search/Search';
import Stack from './components/Stack/Stack';
import CardVisualizer from './components/CardVisualizer/CardVisualizer';
import Players from './components/Players/Players';
import SideNav from './components/SideNav/SideNav';
import { createPlayer, playerColorPalette } from './constants/players';
import './App.css';

const initialPlayers = [createPlayer(1, 'Player 1', 0), createPlayer(2, 'Player 2', 1)];
const maxPlayers = 4;

function App() {
  const [stack, setStack] = useState([]);
  const [resolutionHistory, setResolutionHistory] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [players, setPlayers] = useState(initialPlayers);
  const [activePlayerId, setActivePlayerId] = useState(initialPlayers[0].id);
  const dragPreviewRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function cleanupDragPreview() {
      dragPreviewRef.current?.remove();
      dragPreviewRef.current = null;
      setDraggedIndex(null);
    }

    window.addEventListener('blur', cleanupDragPreview);
    window.addEventListener('pagehide', cleanupDragPreview);
    document.addEventListener('dragend', cleanupDragPreview, true);
    document.addEventListener('drop', cleanupDragPreview, true);
    document.addEventListener('mouseup', cleanupDragPreview, true);
    document.addEventListener('visibilitychange', cleanupDragPreview);

    return () => {
      window.removeEventListener('blur', cleanupDragPreview);
      window.removeEventListener('pagehide', cleanupDragPreview);
      document.removeEventListener('dragend', cleanupDragPreview, true);
      document.removeEventListener('drop', cleanupDragPreview, true);
      document.removeEventListener('mouseup', cleanupDragPreview, true);
      document.removeEventListener('visibilitychange', cleanupDragPreview);
    };
  }, []);

  function addToStack(card) {
    const stackCard = { ...card, controllerId: activePlayerId };
    setStack((current) => [...current, stackCard]);
    setSelectedCard(stackCard);
  }

  function assignController(index, controllerId) {
    setStack((current) => current.map((card, cardIndex) => (
      cardIndex === index ? { ...card, controllerId } : card
    )));
  }

  function addPlayer() {
    if (players.length >= maxPlayers) {
      return;
    }

    const usedIds = new Set(players.map((player) => player.id));
    let id = 1;

    while (usedIds.has(id)) {
      id += 1;
    }

    const usedColors = new Set(players.map((player) => player.color));
    const color = playerColorPalette.find((paletteColor) => !usedColors.has(paletteColor))
      ?? playerColorPalette[0];
    const colorIndex = playerColorPalette.indexOf(color);

    setPlayers((current) => [...current, createPlayer(id, `Player ${id}`, colorIndex)]);
    setActivePlayerId((current) => current ?? id);
  }

  function renamePlayer(id, name) {
    setPlayers((current) => current.map((player) => (
      player.id === id ? { ...player, name } : player
    )));
  }

  function recolorPlayer(id, color) {
    setPlayers((current) => {
      const colorTaken = current.some((player) => player.id !== id && player.color === color);

      if (colorTaken) {
        return current;
      }

      return current.map((player) => (player.id === id ? { ...player, color } : player));
    });
  }

  function removePlayer(id) {
    const remainingPlayers = players.filter((player) => player.id !== id);

    setPlayers(remainingPlayers);
    setStack((current) => current.filter((card) => card.controllerId !== id));
    setResolutionHistory((history) => history.map((card) => (
      card.controllerId === id ? { ...card, controllerId: null } : card
    )));
    setActivePlayerId((current) => (current === id ? remainingPlayers[0]?.id ?? null : current));
  }

  function removeFromStack(index) {
    setStack((current) => current.filter((_, cardIndex) => cardIndex !== index));
  }

  function duplicateStack(index) {
    setStack((current) => [
      ...current.slice(0, index + 1),
      current[index],
      ...current.slice(index + 1),
    ]);
  }

  function clearStack() {
    setStack([]);
  }

  function resolveNext() {
    const [resolvingCard] = stack;

    if (!resolvingCard) {
      return;
    }

    setStack((current) => current.slice(1));
    setResolutionHistory((history) => [...history, resolvingCard]);
    setSelectedCard(resolvingCard);
  }

  function undoResolution() {
    const restoredCard = resolutionHistory.at(-1);

    if (!restoredCard) {
      return;
    }

    setStack((current) => [restoredCard, ...current]);
    setResolutionHistory((history) => history.slice(0, -1));
    setSelectedCard(restoredCard);
  }

  function moveStackCard(dropIndex) {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    setStack((current) => {
      const reorderedStack = [...current];
      const [draggedCard] = reorderedStack.splice(draggedIndex, 1);
      const insertionIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;

      reorderedStack.splice(insertionIndex, 0, draggedCard);
      return reorderedStack;
    });
    setDraggedIndex(draggedIndex < dropIndex ? dropIndex - 1 : dropIndex);
  }

  function startDragging(event, index) {
    const cardPreview = event.currentTarget.cloneNode(true);
    const cardBounds = event.currentTarget.getBoundingClientRect();

    cardPreview.classList.add('stack-card-drag-preview');
    cardPreview.style.width = `${cardBounds.width}px`;
    dragOffsetRef.current = {
      x: event.clientX - cardBounds.left,
      y: event.clientY - cardBounds.top,
    };
    cardPreview.style.left = `${event.clientX - dragOffsetRef.current.x}px`;
    cardPreview.style.top = `${event.clientY - dragOffsetRef.current.y}px`;
    document.body.appendChild(cardPreview);
    dragPreviewRef.current = cardPreview;
    event.dataTransfer.effectAllowed = 'move';
    const transparentDragImage = document.createElement('canvas');
    transparentDragImage.width = 1;
    transparentDragImage.height = 1;
    event.dataTransfer.setDragImage(transparentDragImage, 0, 0);
    setDraggedIndex(index);
  }

  function updateDragPreview(event) {
    if (!dragPreviewRef.current) {
      return;
    }

    dragPreviewRef.current.style.left = `${event.clientX - dragOffsetRef.current.x}px`;
    dragPreviewRef.current.style.top = `${event.clientY - dragOffsetRef.current.y}px`;
  }

  function stopDragging() {
    dragPreviewRef.current?.remove();
    dragPreviewRef.current = null;
    setDraggedIndex(null);
  }

  return (
    <main className="app">
      <h1>MTG Stack Tracker</h1>

      <SideNav>
        <Players
          players={players}
          activePlayerId={activePlayerId}
          maxPlayers={maxPlayers}
          onAddPlayer={addPlayer}
          onRenamePlayer={renamePlayer}
          onRecolorPlayer={recolorPlayer}
          onRemovePlayer={removePlayer}
          onSetActivePlayer={setActivePlayerId}
        />
      </SideNav>

      <div className="layout">
        <section className="search-section">
          <Search
            onCardSelect={addToStack}
            onCardHover={(card) => {
              setHoveredCard(card);
              if (card) setSelectedCard(card);
            }}
          />
        </section>

        <Stack
          stack={stack}
          onCardSelect={setSelectedCard}
          onCardHover={setHoveredCard}
          draggedIndex={draggedIndex}
          onDragStart={startDragging}
          onDragOver={updateDragPreview}
          onDrop={stopDragging}
          onRemove={removeFromStack}
          onDuplicate={duplicateStack}
          onMoveStackCard={moveStackCard}
          onClearStack={clearStack}
          resolutionHistory={resolutionHistory}
          onResolveNext={resolveNext}
          onUndoResolution={undoResolution}
          players={players}
          onAssignController={assignController}
        />

        <section className="visualizer-section">
          <h2>Card Visualizer</h2>
          <CardVisualizer selectedCard={hoveredCard || selectedCard} />
        </section>
      </div>
    </main>
  );
}

export default App;