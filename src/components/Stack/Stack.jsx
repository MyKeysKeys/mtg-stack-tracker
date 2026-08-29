import React from 'react';
import StackCard from './StackCard';

function Stack({
  stack,
  onCardSelect,
  onCardHover,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  onDuplicate,
  onClearStack,
  onMoveStackCard,
  resolutionHistory,
  onResolveNext,
  onUndoResolution,
  players,
  onAssignController,
}) {
  return (
    <section
      className="stack-section"
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onDrop();
        }
      }}
    >
      <div className="stack-heading">
        <h2>Stack ({stack.length} {stack.length === 1 ? 'item' : 'items'})</h2>
        <div className="stack-controls">
          <button
            type="button"
            className="resolve-next-button"
            onClick={onResolveNext}
            disabled={stack.length === 0}
          >
            Resolve next
          </button>
          <button
            type="button"
            className="clear-stack-button"
            onClick={onClearStack}
            disabled={stack.length === 0}
          >
            Clear all
          </button>
        </div>
      </div>
      <div className="stack-list">
        {stack.map((card, index) => (
          <StackCard
            key={`${card.id}-${index}`}
            card={card}
            index={index}
            isDragging={draggedIndex === index}
            isNext={index === 0}
            onCardSelect={onCardSelect}
            onCardHover={onCardHover}
            onDragStart={(event) => onDragStart(event, index)}
            onDragOver={(event) => {
              event.preventDefault();
              onDragOver(event);
              const bounds = event.currentTarget.getBoundingClientRect();
              const targetIndex = event.clientY < bounds.top + bounds.height / 2
                ? index
                : index + 1;
              onMoveStackCard(targetIndex);
            }}
            onDrop={onDrop}
            onRemove={() => onRemove(index)}
            onDuplicate={() => onDuplicate(index)}
            players={players}
            onAssignController={(controllerId) => onAssignController(index, controllerId)}
          />
        ))}
      </div>
      <div className="resolution-history" aria-live="polite">
        <div className="resolution-history-heading">
          <h3>Resolution history</h3>
          <button
            type="button"
            className="undo-resolution-button"
            onClick={onUndoResolution}
            disabled={resolutionHistory.length === 0}
          >
            Undo
          </button>
        </div>
        {resolutionHistory.length === 0 ? (
          <p className="resolution-history-empty">No objects have resolved.</p>
        ) : (
          <ol className="resolution-history-list">
            {[...resolutionHistory].reverse().map((card, index) => {
              const controller = players.find((player) => player.id === card.controllerId);

              return (
                <li
                  key={`${card.id}-${resolutionHistory.length - index - 1}`}
                  className="resolution-history-item"
                  tabIndex="0"
                  onMouseEnter={() => {
                    onCardHover(card);
                    onCardSelect(card);
                  }}
                  onMouseLeave={() => onCardHover(null)}
                  onFocus={() => {
                    onCardHover(card);
                    onCardSelect(card);
                  }}
                  onBlur={() => onCardHover(null)}
                >
                  <span
                    className="controller-badge"
                    style={{ '--controller-color': controller?.color ?? 'transparent' }}
                    aria-hidden="true"
                  />
                  {card.name}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

export default Stack;