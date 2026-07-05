import { useState, useEffect, useRef } from 'react';
import { fetchGameContent } from '../../utils/content';
import { generateSprint } from './logic/generate';
import { advanceTick } from './logic/wip';
import { checkDisruptions } from './logic/disruption';
import { checkTddCondition, createBugTask } from './logic/tdd';
import { calculateResults, selectTip } from './logic/results';
import IntroScreen from './components/IntroScreen';
import CountdownOverlay from './components/CountdownOverlay';
import SprintBoard from './components/SprintBoard';
import ResultsScreen from './components/ResultsScreen';
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
  const [stories, setStories] = useState([]);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [countdownValue, setCountdownValue] = useState(5);
  const [results, setResults] = useState(null);

  // Engine refs — read/written inside setInterval to avoid stale closures
  const storiesRef = useRef([]);
  const elapsedRef = useRef(0);
  const engineRef = useRef({ disruptionEvents: [], scheduledBugs: [], tddTriggered: new Set() });

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

  // Game tick — advance progress + disruptions + TDD checks each second
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      const next = Math.min(elapsedRef.current + 0.05, 80);
      elapsedRef.current = next;
      const engine = engineRef.current;

      // 1. WIP progress
      let updated = advanceTick(storiesRef.current, next, 0.05);

      // 2. Disruption events
      const { stories: afterDisruption, events } = checkDisruptions(updated, engine.disruptionEvents, next);
      updated = afterDisruption;
      engine.disruptionEvents = events;

      // 3. TDD checks — schedule a bug if write tests was done last
      for (const story of updated) {
        if (!engine.tddTriggered.has(story.id) && checkTddCondition(story)) {
          engine.tddTriggered.add(story.id);
          const remaining = 80 - next;
          const bug = createBugTask(story.id, remaining);
          if (bug) {
            const maxDelay = Math.max(1, remaining - bug.estimatedHours);
            engine.scheduledBugs.push({
              bug, storyId: story.id,
              firesAt: next + Math.floor(Math.random() * maxDelay) + 1,
            });
          }
        }
      }

      // 4. Apply any bugs whose scheduled time has arrived
      for (const { bug, storyId } of engine.scheduledBugs.filter((s) => next >= s.firesAt)) {
        updated = updated.map((story) =>
          story.id === storyId ? { ...story, tasks: [...story.tasks, bug] } : story
        );
      }
      engine.scheduledBugs = engine.scheduledBugs.filter((s) => next < s.firesAt);

      storiesRef.current = updated;
      setStories(updated);
      setElapsedHours(next);
      if (next >= 80) {
        const r = calculateResults(updated, next);
        setResults({ ...r, tip: selectTip(r) });
        setPhase('results');
      }
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  const handleTaskAction = (taskId, action) => {
    const updated = storiesRef.current.map((story) => ({
      ...story,
      tasks: story.tasks.map((task) => {
        if (task.id !== taskId) return task;
        if (action === 'start')  return { ...task, status: 'inProgress', startedAt: elapsedRef.current };
        if (action === 'pause')  return { ...task, status: 'blocked' };
        if (action === 'resume') return { ...task, status: 'inProgress' };
        return task;
      }),
    }));
    storiesRef.current = updated;
    setStories(updated);
  };

  const handleStart = () => {
    const sprint = generateSprint();
    storiesRef.current = sprint.stories;
    elapsedRef.current = 0;
    engineRef.current = { disruptionEvents: sprint.disruptionEvents, scheduledBugs: [], tddTriggered: new Set() };
    setStories(sprint.stories);
    setElapsedHours(0);
    setResults(null);
    setCountdownValue(5);
    setPhase('countdown');
  };

  if (!game) return null;

  if (phase === 'intro') {
    return <IntroScreen game={game} onStart={handleStart} />;
  }

  if (phase === 'results') {
    return <ResultsScreen results={results} onPlayAgain={handleStart} />;
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

