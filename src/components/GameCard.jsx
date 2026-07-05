import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const { id, title, accentColour, description } = game;

  return (
    <a
      href={`#${id}`}
      className={`${styles.card} accent-${accentColour}`}
      aria-label={`Play ${title}`}
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </a>
  );
}
