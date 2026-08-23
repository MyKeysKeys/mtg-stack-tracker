import { useState } from 'react';
import CardVisualizer from './components/CardVisualizer/CardVisualizer';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [stack, setStack] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  async function searchCards(event) {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  function addToStack(card) {
    setStack((current) => [card, ...current]);
    setSelectedCard(card);
  }

  function removeFromStack(index) {
    setStack((current) => current.filter((_, cardIndex) => cardIndex !== index));
  }

  return (
    <main className="app">
      <h1>MTG Stack Tracker</h1>

      <div className="layout">
        <section>
          <h2>Card Search</h2>
          <form onSubmit={searchCards}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cards..."
            />
            <button type="submit">Search</button>
          </form>

          {loading && <p>Searching...</p>}

          <div className="results">
            {results.map((card) => (
              <button key={card.id} onClick={() => addToStack(card)}>
                {card.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Stack ({stack.length} {stack.length === 1 ? 'item' : 'items'})</h2>
          {stack.map((card, index) => (
            <div className="stack-card" key={`${card.id}-${index}`}>
              <img
                src={card.image_uris?.small}
                alt={card.name}
                onClick={() => setSelectedCard(card)}
              />
              <button onClick={() => removeFromStack(index)}>Remove</button>
            </div>
          ))}
        </section>

        <section>
          <h2>Card Visualizer</h2>
          <CardVisualizer selectedCard={selectedCard} />
        </section>
      </div>
    </main>
  );
}

export default App;