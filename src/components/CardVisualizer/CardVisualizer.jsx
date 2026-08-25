import React from 'react';

function CardVisualizer({ selectedCard }) {
  if (!selectedCard) {
    return <div>Select a card to see its details.</div>;
  }

  return (
    <div className="card-visualizer">
      <a
        href={selectedCard.scryfall_uri}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${selectedCard.name} on Scryfall`}
      >
        <img src={selectedCard.image_uris.normal} alt={selectedCard.name} />
      </a>
    </div>
  );
}

export default CardVisualizer;