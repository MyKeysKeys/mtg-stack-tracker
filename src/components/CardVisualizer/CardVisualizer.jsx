import React from 'react';

function CardVisualizer({ selectedCard }) {
  if (!selectedCard) {
    return <div>Select a card to see its details.</div>;
  }

  const imageUrl =
    selectedCard.image_uris?.normal ?? selectedCard.card_faces?.[0]?.image_uris?.normal;

  return (
    <div className="card-visualizer">
      {imageUrl ? (
        <a
          href={selectedCard.scryfall_uri}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${selectedCard.name} on Scryfall`}
        >
          <img src={imageUrl} alt={selectedCard.name} />
        </a>
      ) : (
        <p className="card-image-placeholder">No image found</p>
      )}
    </div>
  );
}

export default CardVisualizer;