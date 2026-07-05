import { useState, useEffect } from 'react';
import { fetchGameContent } from '../../utils/content';
import { generateSprint } from './logic/generate';
import IntroScreen from './components/IntroScreen';
import CountdownOverlay from './components/CountdownOverlay';
import SprintBoard from './components/SprintBoard';

export default function Game2() {
  const [phase, setPhase] = useState('intro');
  const [game, setGame] = useState(null);
  const [config, setConfig] = useState(null);
  const [stories, setStories] = useState([]);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [countdownValue, setCountdownValue] = useState(5);

  useEffect(() => {
    fetchGameContent('game-2').then(setGame);
  }, []);

  // Countdown tick
  useEffect(() => {
    if (phase !== 'countdown') return;
    const interval = setInterval(() => {
      setCountdownValue((v) => {
        if (v <= 1) return 0;
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Transition countdown → active when value hits 0
  useEffect(() => {
    if (phase === 'countdown' && countdownValue === 0) {
      const timer = setTimeout(() => setPhase('active'), 600);
      return () => clearTimeout(timer);
    }
  }, [phase, countdownValue]);

  // Game tick — advances elapsedHours each second
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setElapsedHours((h) => Math.min(h + 1, 80));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Sprint over
  useEffect(() => {
    if (phase === 'active' && elapsedHours >= 80) setPhase('results');
  }, [phase, elapsedHours]);

  const handleStart = () => {
    const sprint = generateSprint();
    setConfig(sprint);
    setStories(sprint.stories);
    setElapsedHours(0);
    setCountdownValue(5);
    setPhase('countdown');
  };

  if (!game) return null;

  if (phase === 'intro') {
    return <IntroScreen game={game} onStart={handleStart} />;
  }

  return (
    <div style={{ position: 'relative' }}>
      <SprintBoard
        stories={stories}
        elapsedHours={elapsedHours}
        interactive={phase === 'active'}
      />
      {phase === 'countdown' && <CountdownOverlay value={countdownValue} />}
    </div>
  );
}

