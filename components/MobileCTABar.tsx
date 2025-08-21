'use client';

import React from 'react';
import {Button} from '@/components/ui/button';
import {Calendar, Package, FileText, MessageCircle} from 'lucide-react';
import {useLanguage} from '@/components/LanguageProvider';

export function MobileCTABar() {
    const {t} = useLanguage();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
            <div className="w-full max-w-full px-3 py-3">
                <div className="grid grid-cols-4 gap-1 max-w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollToSection('visit')}
                        className="flex flex-col items-center gap-1 h-12 min-w-0 px-1"
                    >
                        <Calendar size={14}/>
                        <span className="text-xs leading-tight truncate">{t.mobile_cta.book_visit}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollToSection('items')}
                        className="flex flex-col items-center gap-1 h-12 min-w-0 px-1"
                    >
                        <Package size={14}/>
                        <span className="text-xs leading-tight truncate">{t.mobile_cta.items}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollToSection('dossier')}
                        className="flex flex-col items-center gap-1 h-12 min-w-0 px-1"
                    >
                        <FileText size={14}/>
                        <span className="text-xs leading-tight truncate">{t.mobile_cta.apply}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollToSection('contact')}
                        className="flex flex-col items-center gap-1 h-12 min-w-0 px-1"
                    >
                        <MessageCircle size={14}/>
                        <span className="text-xs leading-tight truncate">{t.mobile_cta.contact}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}