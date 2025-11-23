import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'SweatBet - Bet on Your Workouts',
  description: 'Group betting on Strava workouts with ZK proofs',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
