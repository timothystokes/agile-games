import styles from './IntroScreen.module.css';

export default function IntroScreen({ game, onStart }) {
  const { title, body } = game;

  return (
    <section className={`${styles.intro} accent-pink`}>
      <header className={styles.header}>
        <a href="#" className={styles.backLink} aria-label="Back to Home">← BACK</a>
        <h1 className={styles.title}>{title}</h1>
        <button className={styles.startBtn} onClick={onStart}>START</button>
      </header>
      <div className={styles.body}>
        {body.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  );
}
