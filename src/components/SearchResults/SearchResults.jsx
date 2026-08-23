import React from 'react';

function SearchResults({ results, onCardSelect }) {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((card) => (
          <li key={card.id} onClick={() => onCardSelect(card)}>
            {card.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;