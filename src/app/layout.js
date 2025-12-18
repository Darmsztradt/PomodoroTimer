import './globals.scss';
import { Inter } from 'next/font/google';
import { Providers } from '../components/Providers';
import Navbar from '../components/Navbar';

export const metadata = {
    title: 'Pomodoro Timer',
    description: 'Projekt Pomodoro Timer',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    return (
        <html lang="pl">
            <body className={inter.className}>
                <Providers>
                    <div className="app-layout">
                        <Navbar />
                        <main className="content">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}