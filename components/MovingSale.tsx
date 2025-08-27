'use client';

import React, {useState, useEffect, useCallback, useRef} from 'react';
import {motion} from 'framer-motion';
import {Search, Eye, Banknote} from 'lucide-react';
import {Btc, Eth, Sol} from 'react-pay-icons/crypto'
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {useLanguage} from '@/components/LanguageProvider';
import {supabase, Item, ItemStatus, ItemCondition} from '@/lib/supabase';
import {useInView} from 'react-intersection-observer';
import {ItemModal} from '@/components/ItemModal';
import {useIsMobile} from '@/hooks/use-mobile';
import Image from 'next/image';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

type SortOption = 'newest' | 'price_asc' | 'price_desc';

export function MovingSale() {
    const {t} = useLanguage();
    const isMobile = useIsMobile();
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
    const [currentPage, setCurrentPage] = useState(1);

    // Add ref to track component mount state
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Calculate items per page based on screen size
    const itemsPerPage = isMobile ? 4 : 8; // 2x2 on mobile, 2x4 on desktop

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // Adjust current page when screen size changes and current page becomes invalid
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages));
        }
    }, [totalPages, currentPage]);

    // Define functions before useEffect hooks
    const fetchItems = async (): Promise<void> => {
        // Cancel previous request if it exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        const {signal} = abortControllerRef.current;

        try {
            // Check if component is still mounted before starting
            if (!isMountedRef.current) return;

            setLoading(true);
            setError(null);

            const {data, error: fetchError} = await supabase
                .from('items')
                .select('*')
                .order('order_index', {ascending: true})
                .abortSignal(signal); // Add abort signal to Supabase query

            // Check if component is still mounted before updating state
            if (!isMountedRef.current) return;

            if (fetchError) {
                console.error('Error fetching items:', fetchError);
                setError('Failed to load items. Please try again.');
                return;
            }

            setItems(data || []);
        } catch (err) {
            // Check if component is still mounted and error is not from abort
            if (!isMountedRef.current || signal.aborted) return;

            console.error('Unexpected error fetching items:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            // Check if component is still mounted before updating loading state
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const filterAndSortItems = useCallback((): void => {
        // Check if component is still mounted before state updates
        if (!isMountedRef.current) return;

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

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, statusFilter, conditionFilter, sortBy]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            // Cancel any ongoing requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        filterAndSortItems();
    }, [filterAndSortItems]);

    const getStatusBadge = (status: ItemStatus) => {
        const variants = {
            available: 'default',
            reserved: 'secondary',
            sold: 'destructive',
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

    // Add ref for items grid to enable scrolling
    const itemsGridRef = useRef<HTMLDivElement>(null);

    // Smooth scroll to items grid when page changes
    const scrollToItemsGrid = useCallback(() => {
        if (itemsGridRef.current) {
            const yOffset = -80; // Offset to account for any fixed headers
            const element = itemsGridRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    }, []);

    // Handle page navigation with smooth scroll
    const handlePageChange = useCallback((newPage: number) => {
        setCurrentPage(newPage);
        // Small delay to ensure the new content is rendered before scrolling
        setTimeout(() => {
            scrollToItemsGrid();
        }, 100);
    }, [scrollToItemsGrid]);

    // Generate pagination links
    const generatePaginationLinks = () => {
        const links = [];

        // Previous button
        if (currentPage > 1) {
            links.push(
                <PaginationItem key="prev">
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>
            );
        }

        // Page numbers
        const maxVisiblePages = isMobile ? 3 : 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page and ellipsis
        if (startPage > 1) {
            links.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                        }}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                links.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis/>
                    </PaginationItem>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            links.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i);
                        }}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                links.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis/>
                    </PaginationItem>
                );
            }
            links.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Next button
        if (currentPage < totalPages) {
            links.push(
                <PaginationItem key="next">
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            );
        }

        return links;
    };

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
                    initial={{opacity: 0, y: 30}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.8}}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        {t.sale.title}
                    </h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-2xl mx-auto mb-6">
                        <p className="text-amber-800 font-medium">
                            {t.sale.notice}
                        </p>
                    </div>

                    {/* Payment Methods Banner */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={inView ? {opacity: 1, y: 0} : {}}
                        transition={{duration: 0.6, delay: 0.3}}
                        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-2xl mx-auto"
                    >
                        <h3 className="text-sm font-semibold text-emerald-800 mb-3">
                            {t.sale.payment_methods.title}
                        </h3>
                        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-12 w-12 rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center shadow-sm">
                                        <Banknote size={24}/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t.sale.payment_methods.cash} - Swiss Francs (CHF)</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-12 w-12 rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center shadow-sm">
                                        <Image
                                            src="/twint.svg"
                                            width={40}
                                            height={40}
                                            alt="Twint"
                                            className="rounded-lg"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm">{t.sale.payment_methods.twint}</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-12 w-12 rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center shadow-sm">
                                        <Image
                                            src="/revolut-logo-dark.svg"
                                            width={40}
                                            height={40}
                                            alt="Revolut"
                                            className="rounded-lg"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm">{t.sale.payment_methods.revolut}</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-12 w-12 rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center shadow-sm">
                                        <Btc style={{width: 40, height: 40}}/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm">Bitcoin</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-12 w-12 rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center shadow-sm">
                                        <Eth style={{width: 40, height: 40}}/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm">Ethereum</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-12 w-12 rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center shadow-sm">
                                        <Sol style={{width: 40, height: 40}}/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm">Solana</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={inView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.6, delay: 0.2}}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}/>
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
                            <SelectTrigger className="min-w-[140px]">
                                <SelectValue>
                                    <span className="text-sm text-gray-600">{t.sale.filters.category}:</span>{' '}
                                    <span className="font-medium">
                                        {categoryFilter === 'all' ? t.sale.filters.all : categoryFilter}
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t.sale.filters.category}</SelectLabel>
                                    <SelectItem value="all">{t.sale.filters.all}</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter}
                                onValueChange={(value) => setStatusFilter(value as ItemStatus | 'all')}>
                            <SelectTrigger className="min-w-[140px]">
                                <SelectValue>
                                    <span className="text-sm text-gray-600">{t.sale.filters.status}:</span>{' '}
                                    <span className="font-medium">
                                        {statusFilter === 'all' ? t.sale.filters.all : t.sale.status[statusFilter as ItemStatus]}
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t.sale.filters.status}</SelectLabel>
                                    <SelectItem value="all">{t.sale.filters.all}</SelectItem>
                                    <SelectItem value="available">{t.sale.status.available}</SelectItem>
                                    <SelectItem value="reserved">{t.sale.status.reserved}</SelectItem>
                                    <SelectItem value="sold">{t.sale.status.sold}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={conditionFilter}
                                onValueChange={(value) => setConditionFilter(value as ItemCondition | 'all')}>
                            <SelectTrigger className="min-w-[140px]">
                                <SelectValue>
                                    <span className="text-sm text-gray-600">{t.sale.filters.condition}:</span>{' '}
                                    <span className="font-medium">
                                        {conditionFilter === 'all' ? t.sale.filters.all : t.sale.condition[conditionFilter as ItemCondition]}
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t.sale.filters.condition}</SelectLabel>
                                    <SelectItem value="all">{t.sale.filters.all}</SelectItem>
                                    <SelectItem value="new">{t.sale.condition.new}</SelectItem>
                                    <SelectItem value="excellent">{t.sale.condition.excellent}</SelectItem>
                                    <SelectItem value="good">{t.sale.condition.good}</SelectItem>
                                    <SelectItem value="fair">{t.sale.condition.fair}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                            <SelectTrigger className="min-w-[140px]">
                                <SelectValue>
                                    <span className="text-sm text-gray-600">{t.sale.filters.sort}:</span>{' '}
                                    <span className="font-medium">{t.sale.sort[sortBy]}</span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t.sale.filters.sort}</SelectLabel>
                                    <SelectItem value="newest">{t.sale.sort.newest}</SelectItem>
                                    <SelectItem value="price_asc">{t.sale.sort.price_asc}</SelectItem>
                                    <SelectItem value="price_desc">{t.sale.sort.price_desc}</SelectItem>
                                </SelectGroup>
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
                    <>
                        <div ref={itemsGridRef}
                             className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {paginatedItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{opacity: 0, y: 20}}
                                    animate={inView ? {opacity: 1, y: 0} : {}}
                                    transition={{duration: 0.6, delay: index * 0.1}}
                                >
                                    <Card
                                        className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                                            item.status === 'sold' ? 'opacity-50' : ''
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
                                                        className="object-contain rounded-t-lg"
                                                        loading="lazy"
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                                    />
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 flex gap-1">
                                                {getStatusBadge(item.status)}
                                            </div>
                                            {item.images && item.images.length > 1 && (
                                                <div
                                                    className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
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
                                                <Button variant="ghost" size="sm"
                                                        className="ml-2 opacity-70 hover:opacity-100 p-1 md:p-2">
                                                    <Eye size={14} className="md:w-4 md:h-4"/>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={inView ? {opacity: 1, y: 0} : {}}
                                transition={{duration: 0.6, delay: 0.4}}
                                className="mt-8 flex flex-col items-center gap-4"
                            >
                                <Pagination>
                                    <PaginationContent>
                                        {generatePaginationLinks()}
                                    </PaginationContent>
                                </Pagination>

                                {/* Page info */}
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                                </div>
                            </motion.div>
                        )}
                    </>
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