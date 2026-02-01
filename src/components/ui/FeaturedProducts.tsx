"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { supabase } from "@/lib/supabase";
import { Sparkles } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-4" />
          <div className="h-10 w-72 bg-gray-200 dark:bg-white/10 rounded-lg mx-auto mb-3" />
          <div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-white/10 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gamer-card rounded-xl border border-black/10 dark:border-white/5 overflow-hidden"
            >
              {/* Image skeleton - matches h-64 */}
              <div className="h-64 bg-gray-100 dark:bg-white/5" />
              {/* Content skeleton */}
              <div className="p-5">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/10 rounded mb-4" />
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header - Simplified, no motion */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gamer-red/20 dark:bg-gamer-neon/20 border border-gamer-red/30 dark:border-gamer-neon/30 rounded-full">
          <Sparkles
            className="text-gamer-red dark:text-gamer-neon"
            size={18}
            aria-hidden="true"
          />
          <span className="text-sm font-bold text-red-700 dark:text-gamer-neon uppercase tracking-wider">
            Lo Más Nuevo
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-gray-900 dark:text-white">
          PRODUCTOS <span className="text-gamer-red">DESTACADOS</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Lo último en tecnología gaming. Actualizamos nuestro stock
          constantemente.
        </p>
      </div>

      {/* Products Grid - No motion animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} featured />
          </div>
        ))}
      </div>
    </section>
  );
}
