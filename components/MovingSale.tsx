'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase, Item, ItemStatus, ItemCondition } from '@/lib/supabase';
import { useInView } from 'react-intersection-observer';
import { ItemModal } from '@/components/ItemModal';
import Image from 'next/image';

type SortOption = 'newest' | 'price_asc' | 'price_desc';

export function MovingSale() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [conditionFilter, setConditionFilter] = useState<ItemCondition | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filterAndSortItems = useCallback((): void => {
    const filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
    });

    // Sort items with proper type safety
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.ask_price_chf - b.ask_price_chf;
        case 'price_desc':
          return b.ask_price_chf - a.ask_price_chf;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, categoryFilter, statusFilter, conditionFilter, sortBy]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [filterAndSortItems]);

  const fetchItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) {
        console.error('Error fetching items:', fetchError);
        setError('Failed to load items. Please try again.');
        return;
      }

      setItems(data || []);
    } catch (err) {
      console.error('Unexpected error fetching items:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  // Get unique categories with proper type safety
  const categories = Array.from(new Set(items.map(item => item.category)));

  if (loading) {
    return (
      <section id="items" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {t.sale.title}
            </h2>
            <p className="text-lg">Loading items...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="items" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {t.sale.title}
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-2xl mx-auto">
              <p className="text-red-800 font-medium">{error}</p>
              <Button
                onClick={fetchItems}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="items" ref={ref} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {t.sale.title}
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-2xl mx-auto">
            <p className="text-amber-800 font-medium">
              {t.sale.notice}
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.sale.filters.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.sale.filters.all}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ItemStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder={t.sale.filters.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.sale.filters.all}</SelectItem>
                <SelectItem value="available">{t.sale.status.available}</SelectItem>
                <SelectItem value="reserved">{t.sale.status.reserved}</SelectItem>
                <SelectItem value="sold">{t.sale.status.sold}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={conditionFilter} onValueChange={(value) => setConditionFilter(value as ItemCondition | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder={t.sale.filters.condition} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.sale.filters.all}</SelectItem>
                <SelectItem value="new">{t.sale.condition.new}</SelectItem>
                <SelectItem value="excellent">{t.sale.condition.excellent}</SelectItem>
                <SelectItem value="good">{t.sale.condition.good}</SelectItem>
                <SelectItem value="fair">{t.sale.condition.fair}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.sale.sort.newest}</SelectItem>
                <SelectItem value="price_asc">{t.sale.sort.price_asc}</SelectItem>
                <SelectItem value="price_desc">{t.sale.sort.price_desc}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">{t.sale.empty_state}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                    item.status === 'sold' ? 'opacity-75' : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative">
                    {item.images && item.images.length > 0 && (
                      <div className="relative w-full h-40 md:h-48 lg:h-56">
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover rounded-t-lg"
                          loading="lazy"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {getStatusBadge(item.status)}
                    </div>
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        +{item.images.length - 1} more
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-3 md:p-4">
                    <h3 className={`font-semibold text-sm md:text-base mb-2 leading-tight line-clamp-2 ${item.status === 'sold' ? 'line-through' : ''}`}>
                      {item.title}
                    </h3>
                    {item.brand && (
                      <p className="text-xs md:text-sm text-gray-600 mb-2 font-medium">{item.brand}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {getConditionBadge(item.condition)}
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>

                    {/* Item details preview - hide on mobile for space */}
                    <div className="hidden md:block space-y-1 mb-3 text-xs text-gray-600">
                      {item.dimensions_cm && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Dimensions:</span>
                          <span>{item.dimensions_cm}</span>
                        </div>
                      )}
                      {item.colour && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Color:</span>
                          <span>{item.colour}</span>
                        </div>
                      )}
                      {item.weight_kg && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Weight:</span>
                          <span>{item.weight_kg} kg</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`font-bold text-sm md:text-lg mb-1 ${item.status === 'sold' ? 'line-through text-gray-500' : 'text-green-600'}`}>
                          CHF {item.ask_price_chf.toFixed(2)}
                        </p>
                        {item.original_price_chf && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 line-through">
                              CHF {item.original_price_chf.toFixed(2)}
                            </p>
                            <p className="text-xs text-green-600 font-medium">
                              Save {Math.round(((item.original_price_chf - item.ask_price_chf) / item.original_price_chf) * 100)}%
                            </p>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2 opacity-70 hover:opacity-100 p-1 md:p-2">
                        <Eye size={14} className="md:w-4 md:h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}