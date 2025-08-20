'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {useLanguage} from '@/components/LanguageProvider';
import {useInView} from 'react-intersection-observer';

export function VisitBooking() {
    const {t} = useLanguage();
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section id="visit" ref={ref} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.booking.title}
                    </h2>
                    <p className="text-lg text-gray-600">{t.booking.note}</p>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8, delay: 0.2}}
                    className="bg-gray-50 rounded-2xl p-8"
                >
                    {/* Calendly embed placeholder - replace with actual Calendly link */}
                    <div
                        className="w-full h-96 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-600 text-lg mb-4">Calendly Booking Widget</p>
                            <p className="text-sm text-gray-500">
                                Replace this placeholder with your actual Calendly embed code
                            </p>
                            <div className="mt-4">
                                <iframe
                                    src="https://calendly.com/your-calendly-link"
                                    width="100%"
                                    height="300"
                                    style={{border: 0}}
                                    title="Book a visit"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}