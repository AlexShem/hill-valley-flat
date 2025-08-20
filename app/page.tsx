'use client';

import { LanguageProvider } from '@/components/LanguageProvider';
import { MobileCTABar } from '@/components/MobileCTABar';
import { Hero } from '@/components/Hero';
import { WhyThisFlat } from '@/components/WhyThisFlat';
import { PhotoGallery } from '@/components/PhotoGallery';
import { MovingSale } from '@/components/MovingSale';
import { HowItWorks } from '@/components/HowItWorks';
import { DossierChecklist } from '@/components/DossierChecklist';
import { Location } from '@/components/Location';
import { VisitBooking } from '@/components/VisitBooking';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
    return (
        <LanguageProvider>
            <main className="min-h-screen">
                <Hero />
                <WhyThisFlat />
                <PhotoGallery />
                <MovingSale />
                <HowItWorks />
                <DossierChecklist />
                <Location />
                <VisitBooking />
                <FAQ />
                <Contact />
                <Footer />
                <MobileCTABar />
            </main>
        </LanguageProvider>
    );
}