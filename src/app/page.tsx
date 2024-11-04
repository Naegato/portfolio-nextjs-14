import Script from 'next/script';

import styles from './page.module.scss';

export default function Home() {
  return <>
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "Person",
          "name": "Wiatr Maxime",
          "jobTitle": "Développeur Web Full Stack",
          "email": "mailto:maxime.wiatr@gmail.com",
          "telephone": "+33617525075",
          "url": "https://wiatr.fr",
          "knowsAbout": ["Symfony", "React", "Next.js", "PHP", "Docker", "Drupal", "Python"]
        })
      }}
    />
    <main>
      <section>
        <h1 className={styles.title}>Wiatr Maxime</h1>
        <p className={styles.description}>Développeur Web Full Stack</p>
      </section>

      <section>
        <h2 className={styles.subtitle}>Expertise</h2>
        <ul className={styles.list}>
          <li>Symfony</li>
          <li>React</li>
          <li>Next.js</li>
          <li>PHP</li>
          <li>Docker</li>
          <li>Drupal</li>
          <li>Python</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.subtitle}>Contact</h2>
        <p>Email : <a href="mailto:maxime.wiatr@gmail.com">maxime.wiatr@gmail.com</a></p>
        <p>Téléphone : <a href="tel:+33617525075">06 17 52 50 75</a></p>
      </section>
    </main>
  </>;
}
