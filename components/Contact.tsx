'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {Button} from '@/components/ui/button';
import {MessageCircle, Send, Mail} from 'lucide-react';
import {useLanguage} from '@/components/LanguageProvider';
import {useInView} from 'react-intersection-observer';

export function Contact() {
    const {t} = useLanguage();
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Placeholder contact details
    const contacts = {
        whatsapp: 'https://wa.me/qr/QCMSSAUUMXHMK1',
        telegram: 'https://t.me/alexshem',
        email: 'mailto:info@alexhem.dev',
    };

    return (
        <section id="contact" ref={ref} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.contact.title}
                    </h2>
                    <p className="text-lg text-gray-600">{t.contact.note}</p>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8, delay: 0.2}}
                    className="flex flex-col md:flex-row justify-center gap-6"
                >
                    <Button
                        asChild
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg h-auto"
                    >
                        <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={24} className="mr-3"/>
                            {t.contact.whatsapp}
                        </a>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        className="bg-[#24a1de] hover:bg-sky-600 text-white px-8 py-4 text-lg h-auto"
                    >
                        <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
                            <Send size={24} className="mr-3"/>
                            {t.contact.telegram}
                        </a>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-2 px-8 py-4 text-lg h-auto"
                    >
                        <a href={contacts.email}>
                            <Mail size={24} className="mr-3"/>
                            {t.contact.email}
                        </a>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}