import React, { useRef } from 'react';
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
        <button
          type="button"
          className="clear-stack-button"
          onClick={onClearStack}
          disabled={stack.length === 0}
        >
          Clear all
        </button>
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
          />
        ))}
      </div>
    </section>
  );
}

export default Stack;