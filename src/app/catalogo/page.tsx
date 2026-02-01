"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
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

function CatalogoContent() {
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback(
    (filters: FilterState) => {
      let filtered = [...products];

      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower),
        );
      }

      // Category filter
      if (filters.category && filters.category !== "Todos") {
        filtered = filtered.filter((p) => p.category === filters.category);
      }

      // Price filter
      if (filters.priceRange) {
        filtered = filtered.filter(
          (p) =>
            p.price >= filters.priceRange[0] &&
            p.price <= filters.priceRange[1],
        );
      }

      // Sort
      if (filters.sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredProducts(filtered);
    },
    [products],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gamer-red dark:border-gamer-neon"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gamer-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explorá nuestra selección completa de componentes gaming
          </p>
        </div>

        {/* Mobile Filters Heading & Toggle (Visible only on mobile) */}
        <div className="lg:hidden mb-6">
          <CatalogFilters
            onFilterChange={handleFilterChange}
            initialSearch={initialSearch}
            productCount={filteredProducts.length}
          />
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Sidebar (Hidden on mobile, visible on lg) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CatalogFilters
                onFilterChange={handleFilterChange}
                initialSearch={initialSearch}
                productCount={filteredProducts.length}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Count & Header (Desktop) */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Mostrando{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {filteredProducts.length}
                </span>{" "}
                de {products.length} productos
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gamer-card rounded-2xl border border-black/5 dark:border-white/5">
                <Package
                  size={64}
                  className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Intentá ajustar los filtros de búsqueda
                </p>
                <button
                  onClick={() =>
                    handleFilterChange({
                      category: "Todos",
                      priceRange: [0, 1000000],
                      sortBy: "recent",
                      searchQuery: "",
                    })
                  }
                  className="mt-4 px-6 py-2 bg-gamer-red text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gamer-red dark:border-gamer-neon"></div>
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
