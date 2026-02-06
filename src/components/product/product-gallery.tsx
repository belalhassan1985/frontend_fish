"use client";

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from "@/lib/utils";

export function ProductGallery({ media }: { media: any[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ direction: 'rtl' }); // RTL direction

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    const scrollTo = (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    };

    // Helper to resolve URL
    const getMediaUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

    if (!media || media.length === 0) return <div className="aspect-square bg-muted rounded-lg" />;

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm" ref={emblaRef}>
                <div className="flex">
                    {media.map((item, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative aspect-square" key={index}>
                            {item.mediaType === 'YOUTUBE' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
                                    title={item.title}
                                    className="w-full h-full"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            ) : item.mediaType === 'VIDEO' ? (
                                <video src={getMediaUrl(item.url)} controls className="w-full h-full object-contain bg-black" />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={getMediaUrl(item.url)} alt={item.title || 'Product Image'} className="w-full h-full object-contain" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Thumbs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {media.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            "relative flex-[0_0_80px] aspect-square rounded-md overflow-hidden border-2 transition-all",
                            selectedIndex === index ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                    >
                        {item.mediaType === 'YOUTUBE' || item.mediaType === 'VIDEO' ? (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                                VIDEO
                            </div>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={getMediaUrl(item.url)} alt={item.title} className="w-full h-full object-cover" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
