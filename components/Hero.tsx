'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Square, Building, Shirt, Package, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t.hero.title}
          </h1>
          <h2 className="text-xl md:text-2xl text-slate-600 mb-6">
            {t.hero.subtitle}
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {t.hero.availability}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Home size={16} />
            {t.hero.rooms}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Square size={16} />
            {t.hero.area}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Building size={16} />
            {t.hero.manager}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Shirt size={16} />
            {t.hero.features.laundry}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Package size={16} />
            {t.hero.features.cellar}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <ArrowUp size={16} />
            {t.hero.features.lift}
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button 
            size="lg" 
            onClick={() => scrollToSection('visit')}
            className="bg-[#e10600] hover:bg-[#c40500] text-white px-8 py-3 text-lg"
          >
            {t.hero.cta.book_visit}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => scrollToSection('dossier')}
            className="px-8 py-3 text-lg border-2 border-slate-300 hover:bg-slate-50"
          >
            {t.hero.cta.how_to_apply}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}