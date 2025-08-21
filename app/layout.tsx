import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {Analytics} from "@vercel/analytics/next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: '%s | Hill Valley Flat',
        default: '2.5-room Flat for Lease Takeover | Hill Valley, Lausanne'
    },
    description: '2.5-room apartment (55m²) available for lease takeover in Hill Valley, Lausanne. Immediate availability through September 2025. Quiet, bright, excellent transport links to M2 metro.',
    keywords: [
        'apartment',
        'lease takeover',
        'Lausanne',
        'Hill Valley',
        'rental',
        '2.5 rooms',
        'M2 metro',
        'Switzerland',
        'flat',
        'housing'
    ],
    authors: [{name: 'Hill Valley Flat'}],
    creator: 'Hill Valley Flat',
    publisher: 'Hill Valley Flat',
    metadataBase: new URL('https://hill-valley-flat.vercel.app'),
    alternates: {
        canonical: '/',
        languages: {
            'en': '/en',
            'fr': '/fr',
            'ru': '/ru'
        }
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        title: '2.5-room Flat for Lease Takeover | Hill Valley, Lausanne',
        description: '2.5-room apartment (55m²) available for lease takeover in Hill Valley, Lausanne. Immediate availability through September 2025.',
        siteName: 'Hill Valley Flat',
        images: [
            {
                url: '/hill-valley-hero.png',
                width: 1200,
                height: 630,
                alt: 'Hill Valley apartment interior - bright 2.5-room flat in Lausanne',
                type: 'image/png'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: '2.5-room Flat for Lease Takeover | Hill Valley, Lausanne',
        description: '2.5-room apartment (55m²) available for lease takeover in Hill Valley, Lausanne. Immediate availability through September 2025.',
        images: ['/hill-valley-hero.png']
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'real estate',
    other: {
        'geo.region': 'CH-VD',
        'geo.placename': 'Lausanne',
        'geo.position': '46.5197;6.6323',
        'ICBM': '46.5197, 6.6323'
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        <Analytics/>
        </body>
        </html>
    );
}
