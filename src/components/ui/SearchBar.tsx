"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search products in real-time
  useEffect(() => {
    async function searchProducts() {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image_url, category")
          .ilike("name", `%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Error searching products:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gamer-red dark:group-focus-within:text-gamer-neon transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-full py-1.5 pl-10 pr-10 text-sm text-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white dark:focus:bg-black/50 focus:border-gamer-red dark:focus:border-gamer-neon focus:ring-1 focus:ring-gamer-red dark:focus:ring-gamer-neon w-48 lg:w-64 transition-all placeholder:text-gray-400"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      )}

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded flex-shrink-0 overflow-hidden">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${product.price.toLocaleString("es-AR")}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {product.category}
                  </span>
                </Link>
              ))}
              <Link
                href={`/catalogo?search=${encodeURIComponent(query)}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className="block px-4 py-3 text-center text-sm text-gamer-red hover:bg-gray-100 dark:hover:bg-white/5 border-t border-black/10 dark:border-white/10"
              >
                Ver todos los resultados
              </Link>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No se encontraron productos
            </div>
          )}
        </div>
      )}
    </div>
  );
}
