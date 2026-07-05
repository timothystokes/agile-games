import styles from './CountdownOverlay.module.css';

export default function CountdownOverlay({ value }) {
  return (
    <div className={styles.overlay} aria-live="polite" aria-label="Get ready countdown">
      <p className={styles.label}>GET READY</p>
      <span className={styles.count} key={value}>
        {value === 0 ? 'GO!' : value}
      </span>
    </div>
  );
}
