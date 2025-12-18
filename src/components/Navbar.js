'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="main-nav">
            <div className="logo">PomodoroTimer</div>
            <ul>
                <li>
                    <Link href="/" className={pathname === '/' ? 'active' : ''}>
                        Timer
                    </Link>
                </li>
                <li>
                    <Link href="/stats" className={pathname === '/stats' ? 'active' : ''}>
                        Statystyki
                    </Link>
                </li>
                <li>
                    <Link href="/settings" className={pathname === '/settings' ? 'active' : ''}>
                        Ustawienia
                    </Link>
                </li>
            </ul>
        </nav>
    );
}