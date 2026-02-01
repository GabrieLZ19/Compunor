"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Filter, SlidersHorizontal, X } from "lucide-react";

interface CatalogFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
  initialSearch?: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
}

export function CatalogFilters({
  onFilterChange,
  productCount,
  initialSearch = "",
}: CatalogFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "Todos",
    priceRange: [0, 1000000],
    sortBy: "recent",
    searchQuery: initialSearch,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase.from("products").select("category");
        if (data) {
          const unique = Array.from(new Set(data.map((p) => p.category)));
          setCategories(["Todos", ...unique.sort()]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          "Todos",
          "Hardware",
          "Periféricos",
          "Monitores",
          "Sillas",
        ]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Mobile Filter Button - Fixed Top below Navbar */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-40 px-4 py-2  dark:bg-gamer-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white rounded-full text-white dark:text-black font-bold shadow-lg"
        >
          <SlidersHorizontal size={20} className="text-gamer-red" />
          <span>Filtrar y Ordenar</span>
          {filters.category !== "Todos" && (
            <span className="px-2 py-0.5 bg-gamer-red text-white text-xs font-bold rounded-full ml-1">
              1
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      <div
        className={`${
          showMobileFilters
            ? "block fixed inset-0 z-50 overflow-y-auto p-4 bg-gray-50 dark:bg-gamer-dark"
            : "hidden"
        } lg:block space-y-6 bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-xl p-6 shadow-sm`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="text-gamer-red dark:text-gamer-neon" size={20} />
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
              Filtros
            </h3>
          </div>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold text-gamer-red dark:text-gamer-neon">
            {productCount}
          </span>{" "}
          productos encontrados
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Categoría
          </label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateFilter("category", cat)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  filters.category === cat
                    ? "bg-gamer-red dark:bg-gamer-neon text-white font-medium"
                    : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:border-gamer-red dark:focus:border-gamer-neon outline-none transition-colors"
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        {/* Reset Filters */}
        {filters.category !== "Todos" || filters.searchQuery !== "" ? (
          <button
            onClick={() =>
              setFilters({
                category: "Todos",
                priceRange: [0, 1000000],
                sortBy: "recent",
                searchQuery: "",
              })
            }
            className="w-full px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors font-medium"
          >
            Limpiar Filtros
          </button>
        ) : null}
      </div>
    </>
  );
}
