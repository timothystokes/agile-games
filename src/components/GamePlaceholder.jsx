import styles from './GamePlaceholder.module.css';

export default function GamePlaceholder({ game }) {
  const { title, accentColour } = game;

  return (
    <section className={`${styles.placeholder} accent-${accentColour}`}>
      <header className={styles.header}>
        <a href="#" className={styles.backLink} aria-label="Back to home">
          ← Back
        </a>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.spacer} aria-hidden="true" />
      </header>
      <div className={styles.body}>
        <p className={styles.coming}>
          This game is coming soon. Check back shortly.
        </p>
      </div>
    </section>
  );
}
