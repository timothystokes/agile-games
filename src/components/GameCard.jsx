import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const { id, title, principle, accentColour, description } = game;

  return (
    <a
      href={`#${id}`}
      className={`${styles.card} accent-${accentColour}`}
      aria-label={`Play ${title}`}
    >
      <span className={styles.principle}>{principle}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </a>
  );
}
