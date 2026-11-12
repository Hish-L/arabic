import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title: 'Seen & Sheen • Little Letter Garden', description: 'A playful Arabic letter garden. Learn Seen, Sheen, and fatḥa with gentle games.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
