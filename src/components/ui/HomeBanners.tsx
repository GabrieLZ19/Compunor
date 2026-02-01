"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export function HomeBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Show skeleton placeholder to prevent CLS (Cumulative Layout Shift)
  if (loading) {
    return (
      <section className="relative w-full bg-gray-50 dark:bg-gamer-dark/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative aspect-[3/1] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </section>
    );
  }

  // If no banners, show minimal height to prevent shift
  if (banners.length === 0) {
    return (
      <section className="relative w-full bg-gray-50 dark:bg-gamer-dark/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative aspect-[3/1] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900" />
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative w-full bg-gray-50 dark:bg-gamer-dark/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative group">
          {/* Banner Content */}
          <Link
            href={currentBanner.link_url || "#"}
            aria-label={currentBanner.title || "Ver promoción"}
            className="block relative aspect-[3/1] rounded-2xl overflow-hidden bg-gray-200 dark:bg-black/30"
          >
            <Image
              src={currentBanner.image_url}
              alt={currentBanner.title || "Banner promocional"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />

            {/* Overlay with text (optional) */}
            {(currentBanner.title || currentBanner.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                <div className="p-6 sm:p-8 text-white">
                  {currentBanner.title && (
                    <h2 className="text-2xl sm:text-4xl font-display font-bold mb-2">
                      {currentBanner.title}
                    </h2>
                  )}
                  {currentBanner.description && (
                    <p className="text-sm sm:text-base text-gray-200 max-w-2xl">
                      {currentBanner.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Link>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                aria-label="Banner anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black focus:opacity-100 focus:ring-2 focus:ring-gamer-red"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextBanner}
                aria-label="Siguiente banner"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black focus:opacity-100 focus:ring-2 focus:ring-gamer-red"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir al banner ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                  className={`w-2 h-2 rounded-full transition-all focus:ring-2 focus:ring-white ${
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
