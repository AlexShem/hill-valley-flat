'use client';

import React from 'react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Home, Square, Building, Shirt, Package, ArrowUp, ParkingSquare, Building2} from 'lucide-react';
import {motion} from 'framer-motion';
import {useLanguage} from '@/components/LanguageProvider';

export function Hero() {
    const {t} = useLanguage();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };

    return (
        <section
            className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
            style={{
                backgroundImage: "url('/hill-valley-hero.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {t.hero.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl text-white/80 mb-6">
                        {t.hero.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        {t.hero.availability}
                    </p>

                    {/* Pricing Section */}
                    <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 mb-8 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {t.hero.pricing.rent}
                        </div>
                        <div className="text-sm md:text-base text-white/80">
                            {t.hero.pricing.parking}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.2}}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                >
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Home size={16}/>
                        {t.hero.rooms}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Square size={16}/>
                        {t.hero.area}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Building size={16}/>
                        {t.hero.manager}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Shirt size={16}/>
                        {t.hero.features.laundry}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Package size={16}/>
                        {t.hero.features.cellar}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <ArrowUp size={16}/>
                        {t.hero.features.lift}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <ParkingSquare size={16}/>
                        {t.hero.features.parking}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Building2 size={16}/>
                        {t.hero.features.balcony}
                    </Badge>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.4}}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Button
                        size="lg"
                        variant="default"
                        onClick={() => scrollToSection('visit')}
                        className="bg-[#e10600] hover:bg-[#c40500] text-white px-8 py-3 text-lg cursor-pointer"
                    >
                        {t.hero.cta.book_visit}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => scrollToSection('dossier')}
                        className="px-8 py-3 text-lg text-foreground border border-slate-300 hover:bg-slate-50/90 cursor-pointer"
                    >
                        {t.hero.cta.how_to_apply}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}