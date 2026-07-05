import styles from './StoryLane.module.css';

const COLUMNS = ['todo', 'inProgress', 'blocked', 'done'];

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
      <div className={styles.columns}>
        {COLUMNS.map((col) => (
          <div key={col} className={styles.col}>
            {tasks
              .filter((t) => t.status === col)
              .map((task) => (
                <div
                  key={task.id}
                  className={`${styles.task} ${task.isBug ? styles.bug : ''} ${task.status === 'done' ? styles.done : ''}`}
                >
                  <span className={styles.taskName}>{task.name}</span>
                  {task.changed && <span className={styles.changed}>CHANGED</span>}
                  <span className={styles.hours}>{task.estimatedHours}h</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </li>
  );
}
