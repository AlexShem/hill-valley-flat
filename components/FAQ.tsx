'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {useLanguage} from '@/components/LanguageProvider';
import {useInView} from 'react-intersection-observer';

export function FAQ() {
    const {t} = useLanguage();
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section id="faq" ref={ref} className="py-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.faq.title}
                    </h2>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8, delay: 0.2}}
                >
                    <Accordion type="single" collapsible className="space-y-2 md:space-y-4">
                        {t.faq.items.map((item: { question: string; answer: string }, index: number) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-white rounded-2xl px-6 border-0 shadow-sm"
                            >
                                <AccordionTrigger className="text-left hover:no-underline py-6">
                                    <span className="font-medium">{item.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 text-gray-700">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}