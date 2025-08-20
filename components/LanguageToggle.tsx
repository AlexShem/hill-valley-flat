'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/components/LanguageProvider';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ru', label: 'RU' }
  ];

  return (
    <div className={`flex gap-1 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">{t.footer.languages}:</span>
      {languages.map(({ code, label }) => (
        <Button
          key={code}
          variant={language === code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage(code)}
          className="px-2 py-1 h-8 text-sm"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}