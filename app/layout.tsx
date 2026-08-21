import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'AMG Foundation Community Library',description:'A unified community library and learning platform.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}