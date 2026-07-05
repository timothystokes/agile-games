import { useState, useEffect } from 'react';
import { fetchGameContent } from '../../utils/content';
import IntroScreen from './components/IntroScreen';

export default function Game2() {
  const [phase, setPhase] = useState('intro');
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetchGameContent('game-2').then(setGame);
  }, []);

  if (!game) {
    return null;
  }

  if (phase === 'intro') {
    return <IntroScreen game={game} onStart={() => setPhase('countdown')} />;
  }

  return null; // countdown + board arrive in Slice B
}
