import styles from './ResultsScreen.module.css';

function fmt(n) {
  return `$${n.toLocaleString('en-US')}`;
}

export default function ResultsScreen({ results, onPlayAgain }) {
  const { valueDelivered, potentialValue, throughput, cycleTime, storiesCompleted, storiesTotal, tip } = results;

  return (
    <div className={styles.screen}>
      <h1 className={styles.heading}>Sprint Complete</h1>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.label}>Value Delivered</span>
          <span className={styles.value}>{fmt(valueDelivered)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Potential Value</span>
          <span className={styles.value}>{fmt(potentialValue)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Throughput / Day</span>
          <span className={styles.value}>{fmt(throughput)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Avg Cycle Time</span>
          <span className={styles.value}>{cycleTime !== null ? `${Math.round(cycleTime)}h` : '—'}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Stories Finished</span>
          <span className={styles.value}>{storiesCompleted} / {storiesTotal}</span>
        </div>
      </div>

      <div className={styles.tipBox}>
        <span className={styles.tipLabel}>LEARNING TIP</span>
        <p className={styles.tip}>{tip}</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.playAgain} onClick={onPlayAgain}>PLAY AGAIN</button>
        <a href="#" className={styles.backLink}>← BACK TO HOME</a>
      </div>
    </div>
  );
}
