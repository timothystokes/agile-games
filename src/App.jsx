import { useState, useEffect } from 'react';
import { parseHash } from './utils/router';
import { fetchGameContent } from './utils/content';
import HomeScreen from './components/HomeScreen';
import GamePlaceholder from './components/GamePlaceholder';
import Game2 from './games/game2/Game2';
import styles from './App.module.css';

export default function App() {
  const [gameId, setGameId] = useState(() => parseHash(window.location.hash));
  const [game, setGame] = useState(null);

  useEffect(() => {
    const onHashChange = () => setGameId(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!gameId || gameId === 'game-2') return;
    let cancelled = false;
    fetchGameContent(gameId).then((data) => {
      if (!cancelled) setGame(data);
    });
    return () => { cancelled = true; };
  }, [gameId]);

  if (!gameId) {
    return (
      <div className={`${styles.page} ${styles.enter}`}>
        <HomeScreen />
      </div>
    );
  }

  if (gameId === 'game-2') {
    return (
      <div className={`${styles.page} ${styles.enter}`}>
        <Game2 />
      </div>
    );
  }

  if (game && game.id === gameId) {
    return (
      <div className={`${styles.page} ${styles.enter}`}>
        <GamePlaceholder game={game} />
      </div>
    );
  }

  return null;
}
