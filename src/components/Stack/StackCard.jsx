import React, { useState } from 'react';
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
  players,
  onAssignController,
}) {
  const [isControllerPickerOpen, setIsControllerPickerOpen] = useState(false);
  const controller = players.find((player) => player.id === card.controllerId);
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
        <div
          className="stack-card-controller"
          draggable="false"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsControllerPickerOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="controller-badge-toggle"
            style={{ '--controller-color': controller?.color ?? 'transparent' }}
            onClick={() => setIsControllerPickerOpen((current) => !current)}
            aria-haspopup="true"
            aria-expanded={isControllerPickerOpen}
            aria-label={`Change controller of ${card.name}`}
          />
          {isControllerPickerOpen && (
            <div className="controller-options" role="menu">
              <button
                type="button"
                className={`controller-option${card.controllerId == null ? ' controller-option-selected' : ''}`}
                onClick={() => {
                  onAssignController(null);
                  setIsControllerPickerOpen(false);
                }}
                role="menuitemradio"
                aria-checked={card.controllerId == null}
              >
                <span
                  className="controller-badge"
                  style={{ '--controller-color': 'transparent' }}
                  aria-hidden="true"
                />
                Unassigned
              </button>
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className={`controller-option${card.controllerId === player.id ? ' controller-option-selected' : ''}`}
                  onClick={() => {
                    onAssignController(player.id);
                    setIsControllerPickerOpen(false);
                  }}
                  role="menuitemradio"
                  aria-checked={card.controllerId === player.id}
                >
                  <span
                    className="controller-badge"
                    style={{ '--controller-color': player.color }}
                    aria-hidden="true"
                  />
                  {player.name}
                </button>
              ))}
            </div>
          )}
        </div>
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