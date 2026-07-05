import TaskCard from './TaskCard';
import styles from './StoryLane.module.css';

const COLUMN_INDEX = { todo: 0, inProgress: 1, blocked: 2, done: 3 };

function formatValue(n) {
  return `$${n.toLocaleString('en-US')}`;
}

export default function StoryLane({ story, onTaskAction, interactive = false }) {
  const { priority, title, storyPoints, businessValue, tasks } = story;
  const allDone = tasks.every((t) => t.status === 'done');

  return (
    <li className={`${styles.lane} ${allDone ? styles.complete : ''}`}>
      <header className={styles.header}>
        <span className={styles.priority}>P{priority}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>{storyPoints} pts</span>
        <span className={styles.meta}>{formatValue(businessValue)}</span>
      </header>
      <div className={styles.taskRows}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={styles.taskSlider}
            style={{ marginLeft: `${COLUMN_INDEX[task.status] * 25}%` }}
          >
            <TaskCard
              task={task}
              onAction={interactive ? onTaskAction : () => {}}
            />
          </div>
        ))}
      </div>
    </li>
  );
}
