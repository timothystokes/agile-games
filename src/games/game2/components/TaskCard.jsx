import styles from './TaskCard.module.css';

const ACTION_LABEL = { todo: 'START', inProgress: 'PAUSE', blocked: 'RESUME' };
const ACTION_KEY   = { todo: 'start', inProgress: 'pause', blocked: 'resume' };

export default function TaskCard({ task, onAction }) {
  const { id, name, estimatedHours, progressHours, status, isBug, changed } = task;
  const pct = `${Math.min((progressHours / estimatedHours) * 100, 100).toFixed(1)}%`;
  const actionLabel = ACTION_LABEL[status];

  return (
    <div
      className={`${styles.card} ${styles[status]} ${isBug ? styles.bug : ''}`}
      data-status={status}
    >
      {changed && <span className={styles.changed}>CHANGED</span>}
      {isBug && <span className={styles.bugLabel}>🐛 Bug Fix</span>}
      <span className={styles.name}>{name}</span>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          data-progress-fill
          style={{ width: pct }}
        />
      </div>
      <div className={styles.footer}>
        <span className={styles.hours}>{estimatedHours}h</span>
        {actionLabel && (
          <button
            className={styles.actionBtn}
            onClick={() => onAction(id, ACTION_KEY[status])}
            aria-label={`${actionLabel} task ${name}`}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
