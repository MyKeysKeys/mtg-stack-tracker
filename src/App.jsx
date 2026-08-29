import { useEffect, useRef, useState } from 'react';
import Search from './components/Search/Search';
import Stack from './components/Stack/Stack';
import CardVisualizer from './components/CardVisualizer/CardVisualizer';
import './App.css';

function App() {
  const [stack, setStack] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
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
    document.addEventListener('visibilitychange', cleanupDragPreview);

    return () => {
      window.removeEventListener('blur', cleanupDragPreview);
      window.removeEventListener('pagehide', cleanupDragPreview);
      document.removeEventListener('dragend', cleanupDragPreview, true);
      document.removeEventListener('visibilitychange', cleanupDragPreview);
    };
  }, []);

  function addToStack(card) {
    setStack((current) => [...current, card]);
    setSelectedCard(card);
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