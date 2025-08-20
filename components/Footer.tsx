'use client';

import React from 'react';
import {LanguageToggle} from '@/components/LanguageToggle';
import {useLanguage} from '@/components/LanguageProvider';

export function Footer() {
    const {t} = useLanguage();

    return (
        <footer className="bg-slate-900 text-white py-12 pb-24 md:pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Hill Valley, Lausanne</h3>
                        <p className="text-gray-400">2.5-room flat • Lease takeover & Moving sale</p>
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