import { useState, useEffect, useCallback } from 'react';
import { fetchGameContent } from '../../utils/content';
import { generateSprint } from './logic/generate';
import { advanceTick } from './logic/wip';
import IntroScreen from './components/IntroScreen';
import CountdownOverlay from './components/CountdownOverlay';
import SprintBoard from './components/SprintBoard';
import styles from './Game2.module.css';

function BoardHeader({ title, elapsedHours }) {
  const day = Math.min(Math.ceil(elapsedHours / 8), 10);
  return (
    <header className={styles.header}>
      <a href="#" className={styles.backLink} aria-label="Back to Home">← BACK</a>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.dayCounter}>Day {day} / 10</span>
    </header>
  );
}

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
      setCountdownValue((v) => (v <= 1 ? 0 : v - 1));
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

  // Game tick — advance progress each second
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setElapsedHours((h) => {
        const next = Math.min(h + 1, 80);
        setStories((prev) => advanceTick(prev, next));
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Sprint over
  useEffect(() => {
    if (phase === 'active' && elapsedHours >= 80) setPhase('results');
  }, [phase, elapsedHours]);

  const handleTaskAction = useCallback((taskId, action) => {
    setStories((prev) =>
      prev.map((story) => ({
        ...story,
        tasks: story.tasks.map((task) => {
          if (task.id !== taskId) return task;
          if (action === 'start')  return { ...task, status: 'inProgress', startedAt: elapsedHours };
          if (action === 'pause')  return { ...task, status: 'blocked' };
          if (action === 'resume') return { ...task, status: 'inProgress' };
          return task;
        }),
      }))
    );
  }, [elapsedHours]);

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
    <div className={styles.boardView}>
      <BoardHeader title={game.title} elapsedHours={elapsedHours} />
      <SprintBoard
        stories={stories}
        elapsedHours={elapsedHours}
        interactive={phase === 'active'}
        onTaskAction={handleTaskAction}
      />
      {phase === 'countdown' && <CountdownOverlay value={countdownValue} />}
    </div>
  );
}

