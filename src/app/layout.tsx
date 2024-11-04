import { ReactNode } from 'react';
import { Metadata, Viewport } from 'next';
import 'normalize.css';
import './global.scss';

export const metadata: Metadata = {
  title: 'Wiatr Maxime - Développeur Web Full Stack',
  description: 'Portfolio de Wiatr Maxime, développeur web full stack spécialisé en Symfony, React, Next.js, PHP, et Docker.',
  keywords: ['Wiatr Maxime', 'développeur web', 'Symfony', 'React', 'Next.js', 'PHP', 'Docker', 'Drupal', 'Python'],
  authors: [{ name: 'Wiatr Maxime' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
};