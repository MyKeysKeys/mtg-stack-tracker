import React from 'react';

function CardVisualizer({ selectedCard }) {
  if (!selectedCard) {
    return <div>Select a card to see its details.</div>;
  }

  return (
    <div className="card-visualizer">
      <img src={selectedCard.image_uris.normal} alt={selectedCard.name} />
      <h3>{selectedCard.name}</h3>
      <p><strong>Mana Cost:</strong> {selectedCard.mana_cost}</p>
      <p><strong>Type:</strong> {selectedCard.type_line}</p>
      <p><strong>Oracle Text:</strong> {selectedCard.oracle_text}</p>
      {selectedCard.power && <p><strong>Power/Toughness:</strong> {selectedCard.power}/{selectedCard.toughness}</p>}
    </div>
  );
}

export default CardVisualizer;