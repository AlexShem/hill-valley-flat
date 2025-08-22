'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {useLanguage} from '@/components/LanguageProvider';
import {useInView} from 'react-intersection-observer';

export function Location() {
    const {t} = useLanguage();
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section id="location" ref={ref} className="py-16 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.location.title}
                    </h2>
                    <p className="text-lg text-gray-600">{t.location.address}</p>
                </motion.div>

                <div className="flex flex-col">
                    {/* Map */}
                    <motion.div
                        initial={{opacity: 0, x: -30}}
                        animate={inView ? {opacity: 1, x: 0} : {}}
                        transition={{duration: 0.8, delay: 0.2}}
                        className="w-full rounded-2xl overflow-hidden shadow-lg"
                    >
                        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[450px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2738.8264!2d6.6226!3d46.5197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c2e2e8b7d7d7d%3A0x7d7d7d7d7d7d7d7d!2sChemin%20de%20la%20Colline%204%2C%201007%20Lausanne%2C%20Switzerland!5e0!3m2!1sen!2s!4v1234567890"
                                className="absolute inset-0 w-full h-full"
                                style={{border: 0}}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Hill Valley Location"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}