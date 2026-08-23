import React, { useState } from 'react';
import './Search.css';

function Search({ onCardSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${query}`);
    const data = await response.json();
    setResults(data.data);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a card"
      />
      <button onClick={handleSearch}>Search</button>
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

export default Search;