import styles from './Timeline.module.css';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'M', 'T', 'W', 'T', 'F'];

export default function Timeline({ elapsedHours }) {
  const pct = `${Math.min((elapsedHours / 80) * 100, 100)}%`;
  const currentDay = Math.ceil(elapsedHours / 8);

  return (
    <div className={styles.timeline}>
      <div className={styles.weeks}>
        <span className={styles.weekLabel}>Week 1</span>
        <span className={styles.weekLabel}>Week 2</span>
      </div>
      <div className={styles.track}>
        {DAYS.map((day, i) => (
          <div
            key={i}
            className={`${styles.day} ${i < currentDay ? styles.past : ''}`}
            data-day={i + 1}
          >
            {day}
          </div>
        ))}
        <div
          className={styles.marker}
          data-marker
          style={{ left: pct }}
          aria-label={`Day ${currentDay} of 10`}
        />
      </div>
    </div>
  );
}
