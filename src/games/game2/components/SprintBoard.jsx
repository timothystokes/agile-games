import Timeline from './Timeline';
import StoryLane from './StoryLane';
import styles from './SprintBoard.module.css';

const COLUMN_LABELS = ['To Do', 'In Progress', 'Blocked', 'Done'];

export default function SprintBoard({ stories, elapsedHours, interactive = false, onTaskAction }) {
  return (
    <div className={styles.board}>
      <Timeline elapsedHours={elapsedHours} />
      <div className={styles.columns}>
        {COLUMN_LABELS.map((label) => (
          <div key={label} className={styles.colHeader}>{label}</div>
        ))}
      </div>
      <ul className={styles.lanes}>
        {stories.map((story) => (
          <StoryLane
            key={story.id}
            story={story}
            interactive={interactive}
            onTaskAction={onTaskAction}
          />
        ))}
      </ul>
    </div>
  );
}
