import React, { useEffect, useState } from 'react';
import { colorNames } from '../../constants/colors';
import { getCardBackground, getCardColors } from '../../utils/cardColors';

function Search({ onCardSelect, onCardHover }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchNonce, setSearchNonce] = useState(0);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    setResults([]);
    const controller = new AbortController();
    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.scryfall.com/cards/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data.data ?? []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(searchTimeout);
    };
  }, [query, searchNonce]);

  function handleSubmit(event) {
    event.preventDefault();
    setSearchNonce((current) => current + 1);
  }

  return (
    <div>
      <h2>Card Search</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cards..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching...</p>}

      <div className="results">
        {results.slice(0,20).map((card) => (
          <button
            key={card.id}
            className="search-result"
            style={{ '--stack-card-background': getCardBackground(card) }}
            onClick={() => onCardSelect(card)}
            onMouseEnter={() => onCardHover(card)}
            onMouseLeave={() => onCardHover(null)}
            onFocus={() => onCardHover(card)}
            onBlur={() => onCardHover(null)}
          >
            <span className="search-result-name">{card.name}</span>
            <span className="mana-symbols" aria-label="Card colors">
              {getCardColors(card).map((color) => (
                <img
                  key={color}
                  src={`https://svgs.scryfall.io/card-symbols/${color}.svg`}
                  alt={`${colorNames[color]} mana`}
                />
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Search;