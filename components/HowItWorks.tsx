'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {useLanguage} from '@/components/LanguageProvider';
import {useInView} from 'react-intersection-observer';

export function HowItWorks() {
    const {t} = useLanguage();
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section ref={ref} className="py-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.process.title}
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {t.process.steps.map((step: string, index: number) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 20}}
                            animate={inView ? {opacity: 1, y: 0} : {}}
                            transition={{duration: 0.6, delay: index * 0.2}}
                            className="text-center"
                        >
                            <div
                                className="w-12 h-12 bg-[#e10600] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                {index + 1}
                            </div>
                            <p className="font-medium">{step}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.6, delay: 0.8}}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center"
                >
                    <p className="text-blue-800 font-medium">{t.process.note}</p>
                </motion.div>
            </div>
        </section>
    );
}