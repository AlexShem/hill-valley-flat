'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { Item, ItemStatus, ItemCondition } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageProvider';
import Image from 'next/image';

interface ItemModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusBadge = (status: ItemStatus) => {
    const variants = {
      available: 'default',
      reserved: 'secondary',
      sold: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {t.sale.status[status]}
      </Badge>
    );
  };

  const getConditionBadge = (condition: ItemCondition) => {
    return (
      <Badge variant="secondary">
        {t.sale.condition[condition]}
      </Badge>
    );
  };

  const nextImage = () => {
    if (item.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-2xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-base sm:text-lg">
            <span className={item.status === 'sold' ? 'line-through' : ''}>
              {item.title}
            </span>
            <div className="flex gap-2">
              {getStatusBadge(item.status)}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Image Gallery */}
          {item.images && item.images.length > 0 && (
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.images[currentImageIndex]}
                  alt={`${item.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                  priority={currentImageIndex === 0}
                />

                {/* Navigation Arrows */}
                {item.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
                      onClick={nextImage}
                    >
                      <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs sm:text-sm">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {item.images.length > 1 && (
                <div className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${item.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 20vw, (max-width: 1024px) 12vw, 8vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Item Details */}
          <div className="space-y-4 lg:space-y-6">
            {/* Price Section */}
            <div className="border-b pb-3 lg:pb-4">
              <div className="flex items-baseline gap-2 lg:gap-3">
                <span className={`text-2xl lg:text-3xl font-bold ${item.status === 'sold' ? 'line-through text-gray-500' : 'text-green-600'}`}>
                  CHF {item.ask_price_chf.toFixed(2)}
                </span>
                {item.original_price_chf && (
                  <span className="text-base lg:text-lg text-gray-500 line-through">
                    CHF {item.original_price_chf.toFixed(2)}
                  </span>
                )}
              </div>
              {item.original_price_chf && (
                <div className="mt-1">
                  <span className="text-sm text-green-600 font-medium">
                    Save CHF {(item.original_price_chf - item.ask_price_chf).toFixed(2)}
                    ({Math.round(((item.original_price_chf - item.ask_price_chf) / item.original_price_chf) * 100)}% off)
                  </span>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {getConditionBadge(item.condition)}
                <Badge variant="outline">{item.category}</Badge>
                {item.brand && <Badge variant="outline">{item.brand}</Badge>}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 text-sm">
                {item.dimensions_cm && (
                  <div>
                    <span className="font-medium text-gray-700">Dimensions:</span>
                    <span className="ml-2">{item.dimensions_cm}</span>
                  </div>
                )}
                {item.colour && (
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <span className="ml-2">{item.colour}</span>
                  </div>
                )}
                {item.weight_kg && (
                  <div>
                    <span className="font-medium text-gray-700">Weight:</span>
                    <span className="ml-2">{item.weight_kg} kg</span>
                  </div>
                )}
                {item.purchase_date && (
                  <div>
                    <span className="font-medium text-gray-700">Purchase Date:</span>
                    <span className="ml-2">{formatDate(item.purchase_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Notes:</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.notes}</p>
              </div>
            )}

            {/* Pickup Information */}
            {(item.pickup_window_start || item.pickup_window_end) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4">
                <h4 className="font-medium text-blue-900 mb-2">Pickup Window:</h4>
                <div className="text-sm text-blue-800">
                  {item.pickup_window_start && (
                    <div>Start: {new Date(item.pickup_window_start).toLocaleString()}</div>
                  )}
                  {item.pickup_window_end && (
                    <div>End: {new Date(item.pickup_window_end).toLocaleString()}</div>
                  )}
                </div>
              </div>
            )}

            {/* Receipt Link */}
            {item.receipt_url && (
              <div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={item.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    View Original Receipt
                  </a>
                </Button>
              </div>
            )}

            {/* Status Message */}
            {item.status === 'sold' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 lg:p-4">
                <p className="text-red-800 font-medium">This item has been sold.</p>
              </div>
            )}
            {item.status === 'reserved' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 lg:p-4">
                <p className="text-yellow-800 font-medium">This item is currently reserved.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}