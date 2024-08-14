import React, { useState, useEffect } from 'react';
import './App.css';

function generateRandomPosition(size, boardWidth, boardHeight) {
  const positions = [];
  const minDistance = 60;
  while (positions.length < size) {
    const x = Math.floor(Math.random() * (boardWidth - 60)) + 10;
    const y = Math.floor(Math.random() * (boardHeight - 60)) + 10;
    const overlap = positions.some(pos => 
      Math.abs(pos.x - x) < minDistance && Math.abs(pos.y - y) < minDistance
    );
    if (!overlap) {
      positions.push({ x, y });
    }
  }
  return positions;
}

function App() {
  const [points, setPoints] = useState(10);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState('notStarted'); 
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);

  const boardWidth = 800; 
  const boardHeight = 600;

  useEffect(() => {
    if (status === 'playing') {
      const timer = setInterval(() => {
        setTime(prevTime => prevTime + 0.1);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [status]);

  const handleRestart = () => {
    if (points <= 0) {
      alert("Points phải là số dương!");
      return;
    }

    setTime(0);
    setStatus('playing');
    const newSequence = Array.from({ length: points }, (_, i) => i + 1);
    const positions = generateRandomPosition(points, boardWidth, boardHeight);
    setSequence(newSequence.map((num, i) => ({ num, pos: positions[i], visible: true })));
    setUserSequence([]);
  };

  const handleClick = (num) => {
    if (status !== 'playing') return;

    setSequence(prevSequence => 
      prevSequence.map(item => 
        item.num === num ? { ...item, visible: false } : item
      )
    );

    const newUserSequence = [...userSequence, num];
    setUserSequence(newUserSequence);

    if (num !== userSequence.length + 1) {
      setStatus('gameOver');
    } else if (newUserSequence.length === sequence.length) {
      setStatus('allCleared');
    }
  };

  return (
    <div className="App">
      <h1 className={
        status === 'playing' ? 'playing' 
        : status === 'gameOver' ? 'gameOver' 
        : status === 'allCleared' ? 'allCleared' 
        : 'notStarted' 
      }>
        {status === 'playing' || status === 'notStarted' ? "LET'S PLAY" 
        : status === 'gameOver' ? 'GAME OVER' 
        : status === 'allCleared' ? 'ALL CLEARED' : ''}
      </h1>
      <label>
        Points: 
        <input
          min="1"
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
        />
      </label>
      <div>Time: {time.toFixed(1)}s</div>
      <button onClick={handleRestart}>
        {status === 'notStarted' ? 'Play' : 'Restart'}
      </button>
      <div className="game-board" style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}>
        {sequence.map(({ num, pos, visible }) => (
          visible && (
            <div
              key={num}
              className="circle"
              onClick={() => handleClick(num)}
              style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
            >
              {num}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default App;
