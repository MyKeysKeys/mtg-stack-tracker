import { useEffect, useState } from 'react';
import CardVisualizer from './components/CardVisualizer/CardVisualizer';
import './App.css';

const colorOrder = ['W', 'U', 'B', 'R', 'G'];
const colorNames = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
};
const colorValues = {
  W: '#f3e8b0',
  U: '#78a9d8',
  B: '#6d6675',
  R: '#d87568',
  G: '#7dab73',
};

function getCardColors(card) {
  return colorOrder.filter((color) => card.colors?.includes(color));
}

function getCardBackground(card) {
  const colors = getCardColors(card).map((color) => colorValues[color]);

  if (colors.length === 0) {
    return '#e5e2dc';
  }

  if (colors.length === 1) {
    return colors[0];
  }

  const segmentSize = 100 / colors.length;
  const transitionWidth = Math.min(2, segmentSize / 8);
  const stops = [`${colors[0]} 0%`];

  colors.forEach((color, index) => {
    const end = (index + 1) * segmentSize;
    const isLastColor = index === colors.length - 1;

    stops.push(`${color} ${isLastColor ? 100 : end - transitionWidth}%`);
    if (!isLastColor) {
      stops.push(`${colors[index + 1]} ${end + transitionWidth}%`);
    }
  });

  return `linear-gradient(110deg, ${stops.join(', ')})`;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [stack, setStack] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  function searchCards(event) {
    event.preventDefault();
    setSearchNonce((current) => current + 1);
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
        <section className="search-section">
          <h2>Card Search</h2>
          <form className="search-form" onSubmit={searchCards}>
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
              <button
                key={card.id}
                className="search-result"
                style={{ '--stack-card-background': getCardBackground(card) }}
                onClick={() => addToStack(card)}
                onMouseEnter={() => {
                  setHoveredCard(card);
                  setSelectedCard(card);
                }}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => {
                  setHoveredCard(card);
                  setSelectedCard(card);
                }}
                onBlur={() => setHoveredCard(null)}
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
        </section>

        <section className="stack-section">
          <h2>Stack ({stack.length} {stack.length === 1 ? 'item' : 'items'})</h2>
          <div className="stack-list">
            {stack.map((card, index) => (
              <div
                className={`stack-card${index === 0 ? ' stack-card-next' : ''}`}
                key={`${card.id}-${index}`}
                style={{ '--stack-card-background': getCardBackground(card) }}
                onMouseEnter={() => {
                  setHoveredCard(card);
                  setSelectedCard(card);
                }}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => {
                  setHoveredCard(card);
                  setSelectedCard(card);
                }}
                onBlur={() => setHoveredCard(null)}
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
                  <span>{index === 0 ? 'Resolves next' : `Position ${stack.length - index}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromStack(index)}
                  aria-label={`Remove ${card.name} from the stack`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="visualizer-section">
          <h2>Card Visualizer</h2>
          <CardVisualizer selectedCard={hoveredCard || selectedCard} />
        </section>
      </div>
    </main>
  );
}

export default App;