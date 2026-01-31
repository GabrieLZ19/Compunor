"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { CatalogFilters, FilterState } from "@/components/ui/CatalogFilters";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialSearch, setInitialSearch] = useState("");

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setInitialSearch(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleFilterChange = useCallback(
    (filters: FilterState) => {
      let filtered = [...products];

      // Filter by category
      if (filters.category !== "Todos") {
        filtered = filtered.filter((p) => p.category === filters.category);
      }

      // Sort
      switch (filters.sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // recent (already sorted by created_at)
          break;
      }

      setFilteredProducts(filtered);
    },
    [products],
  );

  return (
    <div className="min-h-screen py-12">
      {/* Header */}
      <motion.div
        className="text-center mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gamer-red/10 dark:bg-gamer-neon/10 border border-gamer-red/20 dark:border-gamer-neon/20 rounded-full">
          <Package className="text-gamer-red dark:text-gamer-neon" size={20} />
          <span className="text-sm font-bold text-gamer-red dark:text-gamer-neon uppercase tracking-wider">
            Catálogo Completo
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-black mb-4 text-gray-900 dark:text-white">
          NUESTRO{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gamer-red to-gamer-neon">
            CATÁLOGO
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Explorá lo último en tecnología y gaming. Precios actualizados
          diariamente.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Sticky */}
          <aside className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24">
              <CatalogFilters
                onFilterChange={handleFilterChange}
                productCount={filteredProducts.length}
                initialSearch={initialSearch}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gamer-red mx-auto" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Cargando inventario...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                <Package
                  className="mx-auto mb-4 text-gray-400"
                  size={64}
                  strokeWidth={1}
                />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Probá ajustando los filtros o buscando otro término.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
