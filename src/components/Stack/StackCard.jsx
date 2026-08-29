import React from 'react';
import { colorNames } from '../../constants/colors';
import { getCardBackground, getCardColors } from '../../utils/cardColors';

function StackCard({
  card,
  index,
  isDragging,
  isNext,
  onCardSelect,
  onCardHover,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  onDuplicate,
}) {
  return (
    <div
      className={`stack-card${isNext ? ' stack-card-next' : ''}${
        isDragging ? ' stack-card-dragging' : ''
      }`}
      style={{ '--stack-card-background': getCardBackground(card) }}
      draggable="true"
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDrop}
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
      tabIndex="0"
    >
      <div className="stack-card-details">
        <strong className="stack-card-name">
          <span>{card.name}</span>
          <span className="mana-symbols" aria-label="Card colors">
            {getCardColors(card).map((color) => (
              <img
                key={color}
                src={`https://svgs.scryfall.io/card-symbols/${color}.svg`}
                alt={`${colorNames[color]} mana`}
              />
            ))}
          </span>
        </strong>
        <span>{isNext ? 'Resolves next' : `Position ${index}`}</span>
      </div>
      <div className="stack-card-actions">
        <button
          type="button"
          className="stack-card-action stack-card-duplicate"
          onClick={onDuplicate}
          aria-label={`Duplicate ${card.name} in the stack`}
          title={`Duplicate ${card.name} in the stack`}
        >
          <span className="duplicate-icon" aria-hidden="true">
            <span />
          </span>
        </button>
        <button
          type="button"
          className="stack-card-action stack-card-remove"
          onClick={onRemove}
          aria-label={`Remove ${card.name} from the stack`}
          title={`Remove ${card.name} from the stack`}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default StackCard;