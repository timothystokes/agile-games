import styles from './GamePlaceholder.module.css';

export default function GamePlaceholder({ game }) {
  const { title, principle, accentColour } = game;

  return (
    <section className={`${styles.placeholder} accent-${accentColour}`}>
      <a href="#" className={styles.backLink} aria-label="Back to home">
        ← Back to Home
      </a>
      <span className={styles.principle}>{principle}</span>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.coming}>
        This game is coming soon. Check back shortly.
      </p>
    </section>
  );
}
