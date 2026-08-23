import React from 'react';

function StackControls({ onAddCard, onRemoveTopCard, onClearStack }) {
  return (
    <div className="stack-controls">
      <button onClick={onAddCard}>Add Card</button>
      <button onClick={onRemoveTopCard}>Remove Top Card</button>
      <button onClick={onClearStack}>Clear Stack</button>
    </div>
  );
}

export default StackControls;