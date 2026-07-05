import { useState, useEffect } from 'react';
import { fetchGameContent } from '../utils/content';
import GameCard from './GameCard';
import styles from './HomeScreen.module.css';

const GAME_IDS = ['game-1', 'game-2', 'game-3', 'game-4', 'game-5'];

export default function HomeScreen() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(GAME_IDS.map(fetchGameContent)).then((results) => {
      setGames(results.filter(Boolean));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        Loading games…
      </div>
    );
  }

  return (
    <section className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Agile Games</h1>
        <p className={styles.subtitle}>
          Hands-on simulations that make agile principles tangible.
        </p>
      </header>
      <ul className={styles.grid} aria-label="Available games">
        {games.map((game) => (
          <li key={game.id}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}
