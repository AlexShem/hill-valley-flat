'use client';

import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {X, ChevronLeft, ChevronRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useInView} from 'react-intersection-observer';
import Image from "next/image";
import {useLanguage} from '@/components/LanguageProvider';

interface Photo {
    src: string;
    caption: string;
}

export function PhotoGallery() {
    const {t} = useLanguage();
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeGallery, setActiveGallery] = useState<'current' | 'empty'>('current');

    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const currentPhotos: Photo[] = [
        {src: '/agency-general.jpg', caption: t.photos.captions.overview},
        {src: '/agency-living-room.jpg', caption: t.photos.captions.living_room},
        {src: '/agency-kitchen.jpg', caption: t.photos.captions.kitchen},
        {src: '/agency-bedroom.jpg', caption: t.photos.captions.bedroom},
        {src: '/plan.png', caption: t.photos.captions.floor_plan},
        {src: '/outdoor_view.png', caption: t.photos.captions.outdoor_view},
    ];

    const emptyPhotos: Photo[] = [
        {src: '/move-in-living-room.jpg', caption: t.photos.captions.empty_living_room},
        {src: '/move-in-kitchen.jpg', caption: t.photos.captions.empty_kitchen},
        {src: '/move-in-bedroom.jpg', caption: t.photos.captions.empty_bedroom},
        {src: '/move-in-bedroom-2.jpg', caption: t.photos.captions.empty_bedroom},
        {src: '/move-in-bathroom.jpg', caption: t.photos.captions.bathroom},
        {src: '/outdoor_view_real.jpg', caption: t.photos.captions.outdoor_view},
    ];

    const photos = activeGallery === 'current' ? currentPhotos : emptyPhotos;

    const openLightbox = (photo: Photo, index: number) => {
        setSelectedPhoto(photo);
        setCurrentIndex(index);
    };

    const nextPhoto = () => {
        const nextIndex = (currentIndex + 1) % photos.length;
        setCurrentIndex(nextIndex);
        setSelectedPhoto(photos[nextIndex]);
    };

    const prevPhoto = () => {
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        setCurrentIndex(prevIndex);
        setSelectedPhoto(photos[prevIndex]);
    };

    return (
        <section id="photos" ref={ref} className="py-16 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.photos.title}
                    </h2>

                    <div className="flex justify-center gap-4 mb-8">
                        <Button
                            variant={activeGallery === 'current' ? 'default' : 'outline'}
                            onClick={() => setActiveGallery('current')}
                        >
                            {t.photos.agency_setup}
                        </Button>
                        <Button
                            variant={activeGallery === 'empty' ? 'default' : 'outline'}
                            onClick={() => setActiveGallery('empty')}
                        >
                            {t.photos.empty_move_in}
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={`${activeGallery}-${index}`}
                            initial={{opacity: 0, scale: 0.8}}
                            animate={inView ? {opacity: 1, scale: 1} : {}}
                            transition={{duration: 0.6, delay: index * 0.1}}
                            className="aspect-square cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            onClick={() => openLightbox(photo, index)}
                        >
                            <Image
                                width="200"
                                height="200"
                                src={photo.src}
                                alt={photo.caption}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <div className="relative w-full h-full flex flex-col max-w-6xl">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-4 right-4 z-10 text-foreground"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X size={24}/>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                            onClick={prevPhoto}
                        >
                            <ChevronLeft size={24}/>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                            onClick={nextPhoto}
                        >
                            <ChevronRight size={24}/>
                        </Button>

                        {/* Image container with proper height constraint */}
                        <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
                            <Image
                                width="1200"
                                height="1200"
                                src={selectedPhoto.src}
                                alt={selectedPhoto.caption}
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        </div>

                        {/* Caption at bottom */}
                        <div className="flex-shrink-0 pb-4">
                            <p className="text-white text-center text-lg">
                                {selectedPhoto.caption}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}