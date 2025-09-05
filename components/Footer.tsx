'use client';

import React from 'react';
import {LanguageToggle} from '@/components/LanguageToggle';
import {useLanguage} from '@/components/LanguageProvider';
import {ExternalLink, Mail, MessageCircle, Send} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export function Footer() {
    const {t} = useLanguage();

    // Contact details from Contact component
    const contacts = {
        github: 'https://github.com/alexshem/hill-valley-flat',
        whatsapp: 'https://wa.me/qr/QCMSSAUUMXHMK1',
        telegram: 'https://t.me/alexshem',
        email: 'mailto:info@alexhem.dev',
    };

    return (
        <footer className="bg-slate-900 text-white py-12 pb-24 md:pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Hill Valley, Lausanne</h3>
                        <p className="text-gray-400">2.5-room flat • Lease takeover & Moving sale</p>
                        <p className="text-sm text-gray-500 font-mono mt-1">{t.hero.reference}</p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 p-2 h-auto fill-gray-400 hover:fill-black"
                                asChild
                            >
                                <Link
                                    href={contacts.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="GitHub Repository"
                                >
                                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <title>GitHub</title>
                                        <path
                                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                    </svg>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-green-400 p-2 h-auto"
                                asChild
                            >
                                <Link
                                    href={contacts.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp"
                                >
                                    <MessageCircle size={20}/>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-sky-400 p-2 h-auto"
                                asChild
                            >
                                <Link
                                    href={contacts.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Telegram"
                                >
                                    <Send size={20}/>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-blue-400 p-2 h-auto"
                                asChild
                            >
                                <Link
                                    href={contacts.email}
                                    title="Email"
                                >
                                    <Mail size={20}/>
                                </Link>
                            </Button>
                        </div>

                        <p className="block text-gray-600 mt-4">
                            Built with 💙 by{' '}
                            <Button variant="link"
                                    className="p-0 h-auto text-blue-400/60 hover:text-blue-300 underline">
                                <Link
                                    href="https://alexhem.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1"
                                >
                                    Aleksandr Shemendyuk
                                    <ExternalLink size={14} className="inline"/>
                                </Link>
                            </Button>
                            {' '}using Next.js, Tailwind CSS, Supabase & Vercel.
                        </p>
                    </div>

                    <LanguageToggle/>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p className="mb-2">{t.footer.disclaimer}</p>
                    <p>{t.footer.privacy}</p>
                </div>
            </div>
        </footer>
    );
}