import './globals.scss';
import { Inter } from 'next/font/google';
import { Providers } from '../components/Providers';
import Navbar from '../components/Navbar';

export const metadata = {
    title: 'Pomodoro Timer',
    description: 'Projekt Pomodoro Timer',
};

const inter = Inter({ subsets: ['latin'] });

// Główny layout aplikacji, który otacza wszystkie strony
export default function RootLayout({ children }) {
    return (
        <html lang="pl">
            {/* Aplikowanie klasy czcionki do body */}
            <body className={inter.className}>
                {/* Providers otaczają całą aplikację, aby udostępnić stan globalny */}
                <Providers>
                    <div className="app-layout">
                        {/* Pasek nawigacyjny widoczny na każdej stronie */}
                        <Navbar />
                        {/* Główna zawartość strony, gdzie renderowane są poszczególne podstrony (children) */}
                        <main className="content">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}