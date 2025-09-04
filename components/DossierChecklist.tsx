'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {CheckCircle, ExternalLink} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/LanguageProvider';
import {useInView} from 'react-intersection-observer';

export function DossierChecklist() {
    const {t} = useLanguage();
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Placeholder URLs - these would be replaced with actual links
    const links = {
        baloise: 'https://flatfox.ch/d/dcazcq/',
        poursuites: 'https://www.vd.ch/prestation/demander-un-extrait-du-registre-des-poursuites-pour-soi-meme',
    };

    return (
        <section id="dossier" ref={ref} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.dossier.title}
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Checklist */}
                    <motion.div
                        initial={{opacity: 0, x: -30}}
                        animate={inView ? {opacity: 1, x: 0} : {}}
                        transition={{duration: 0.8, delay: 0.2}}
                    >
                        <h3 className="text-xl font-semibold mb-6">{t.dossier.required_documents}</h3>
                        <div className="space-y-4">
                            {t.dossier.checklist.map((item: string, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, x: -20}}
                                    animate={inView ? {opacity: 1, x: 0} : {}}
                                    transition={{duration: 0.6, delay: 0.3 + index * 0.1}}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20}/>
                                    <span>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Official Links */}
                    <motion.div
                        initial={{opacity: 0, x: 30}}
                        animate={inView ? {opacity: 1, x: 0} : {}}
                        transition={{duration: 0.8, delay: 0.4}}
                    >
                        <h3 className="text-xl font-semibold mb-6">{t.dossier.official_links}</h3>
                        <div className="space-y-4">
                            <Button
                                asChild
                                className="w-full justify-between bg-[#e10600] hover:bg-[#c40500] text-white"
                                size="lg"
                            >
                                <a href={links.baloise} target="_blank" rel="noopener noreferrer">
                                    {t.dossier.links.baloise}
                                    <ExternalLink size={20}/>
                                </a>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-between"
                                size="lg"
                            >
                                <a href={links.poursuites} target="_blank" rel="noopener noreferrer">
                                    {t.dossier.links.poursuites}
                                    <ExternalLink size={20}/>
                                </a>
                            </Button>
                        </div>

                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={inView ? {opacity: 1, y: 0} : {}}
                            transition={{duration: 0.6, delay: 0.8}}
                            className="mt-6 p-4 bg-gray-50 rounded-lg"
                        >
                            <p className="text-sm text-gray-600 italic">
                                {t.dossier.disclaimer}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}