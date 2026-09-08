import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
const sans = DM_Sans({subsets:['latin'],variable:'--font-sans'});
const display = Playfair_Display({subsets:['latin'],variable:'--font-display'});
export const metadata: Metadata = { title:'Lukas Tadros — Personal website', description:'School, coursework, projects, and travels. A personal website by Lukas Tadros.' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>}
