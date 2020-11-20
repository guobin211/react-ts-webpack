import React, { memo } from 'react';
import { hot } from 'react-hot-loader/root';

interface CounterProps {
  initialCount?: number;
}

const Counter = memo(function Counter({ initialCount = 0 }: CounterProps) {
  console.log('Counter', 'render');
  const [count, setCount] = React.useState(initialCount);

  const add = () => {
    setCount(count + 1);
  };

  return (
      <div className="counter">
        <input type="text" value={count} readOnly/>
        <button type="button" onClick={add}>+</button>
      </div>
  );
});

function App() {
  return (
      <div className="app">
        <h2 className="title">react typescript webpack 999</h2>
        <Counter/>
      </div>
  );
}

export default hot(App);