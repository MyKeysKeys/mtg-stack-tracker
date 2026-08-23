import React from 'react';

function StackCard({ card }) {
  return (
    <div className="stack-card">
      <img src={card.image_uris.small} alt={card.name} />
      <div className="card-text">{card.oracle_text}</div>
    </div>
  );
}

export default StackCard;