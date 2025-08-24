'use client';

import React from 'react';
import {LanguageToggle} from '@/components/LanguageToggle';
import {useLanguage} from '@/components/LanguageProvider';
import {ExternalLink} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export function Footer() {
    const {t} = useLanguage();

    return (
        <footer className="bg-slate-900 text-white py-12 pb-24 md:pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Hill Valley, Lausanne</h3>
                        <p className="text-gray-400">2.5-room flat • Lease takeover & Moving sale</p>
                        <p className="text-gray-400 mt-2 flex items-center gap-1">
                            Built by
                            <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300 underline">
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