import React from 'react';
import StackCard from './StackCard';
import './Stack.css';

function Stack({ stack }) {
  return (
    <div>
      <h2>Stack ({stack.length} cards)</h2>
      <div className="stack">
        {stack.map((card, index) => (
          <StackCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export default Stack;