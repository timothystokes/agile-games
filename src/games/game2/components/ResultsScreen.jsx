import styles from './ResultsScreen.module.css';

function fmt(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function ResultsScreen({ results, onPlayAgain }) {
  const { valueDelivered, potentialValue, throughput, cycleTime, storiesCompleted, storiesTotal, maxWip, tips } = results;
  const potentialThroughput = potentialValue / 10;

  return (
    <div className={styles.screen}>
      <h1 className={styles.heading}>Sprint Complete</h1>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.label}>Value Delivered</span>
          <div className={styles.pair}>
            <span className={styles.achieved}>{fmt(valueDelivered)}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.potential}>{fmt(potentialValue)}</span>
          </div>
          <span className={styles.sublabel}>potential</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Throughput / Day</span>
          <div className={styles.pair}>
            <span className={styles.achieved}>{fmt(throughput)}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.potential}>{fmt(potentialThroughput)}</span>
          </div>
          <span className={styles.sublabel}>potential</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Stories Completed</span>
          <div className={styles.pair}>
            <span className={styles.achieved}>{storiesCompleted}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.potential}>{storiesTotal}</span>
          </div>
          <span className={styles.sublabel}>total</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Avg Cycle Time</span>
          <div className={styles.pair}>
            <span className={styles.achieved}>{cycleTime !== null ? `${Math.round(cycleTime)}h` : '—'}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.potential}>80h</span>
          </div>
          <span className={styles.sublabel}>sprint</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Peak WIP</span>
          <div className={styles.pair}>
            <span className={maxWip > 1 ? styles.achievedWarn : styles.achieved}>{maxWip}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.potential}>1</span>
          </div>
          <span className={styles.sublabel}>ideal</span>
        </div>
      </div>

      <div className={styles.tips}>
        {tips.map((tip, i) => (
          <div key={i} className={styles.tipBox}>
            <span className={styles.tipLabel}>LEARNING TIP</span>
            <p className={styles.tip}>{tip}</p>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.playAgain} onClick={onPlayAgain}>PLAY AGAIN</button>
        <a href="#" className={styles.backLink}>← BACK TO HOME</a>
      </div>
    </div>
  );
}
