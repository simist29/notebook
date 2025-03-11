import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bibelstudie-App',
    description: 'Din personliga bibelstudie-app byggd med Next.js och Tailwind',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="sv">
        <body className="min-h-screen bg-gray-100 text-gray-900 flex">
        {/* Sidomeny */}
        <aside className="w-64 bg-white shadow-md p-4">
            <h1 className="text-xl font-bold mb-4">📖 Bibelstudier</h1>
            <nav className="space-y-2">
                <a href="#" className="block p-2 rounded hover:bg-gray-200">Hem</a>
                <a href="#" className="block p-2 rounded hover:bg-gray-200">Mina anteckningar</a>
                <a href="#" className="block p-2 rounded hover:bg-gray-200">Favoriter</a>
            </nav>
        </aside>

        {/* Huvudinnehåll */}
        <main className="flex-1 p-8 overflow-y-auto">
            {children}
        </main>
        </body>
        </html>
    );
}