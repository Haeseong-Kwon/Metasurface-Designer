import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'MetaSurface Designer Pro | AI-Powered Metalens Engineering',
    description: 'Advanced AI platform for Inverse Design and GDSII Export of Metalenses. Developed by Haeseong Kwon.',
    keywords: ['Metasurface', 'Metalens', 'Inverse Design', 'AI Physics', 'GDSII Export', 'Surrogate Model'],
    authors: [{ name: 'Haeseong Kwon', url: 'https://github.com/Haeseong-Kwon' }],
    openGraph: {
        title: 'MetaSurface Designer Pro',
        description: 'AI-Powered Metalens Engineering Platform',
        type: 'website',
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}>
                {children}
            </body>
        </html>
    );
}
