"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchBar } from "@/components/ui/SearchBar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gamer-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-gamer-red/50 dark:border-gamer-neon/50 group-hover:border-gamer-red dark:group-hover:border-gamer-neon transition-colors duration-300">
                <Image
                  src="/logo.jpg"
                  alt="Compunor Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gamer-red to-gray-900 dark:from-white dark:via-gamer-neon dark:to-white group-hover:from-gamer-red group-hover:to-gamer-red dark:group-hover:from-gamer-neon dark:group-hover:to-gamer-neon transition-all duration-300">
                  COMPUNOR
                </span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                  Gaming Store
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gamer-red dark:hover:text-gamer-neon font-sans font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="text-gray-600 dark:text-gray-300 hover:text-gamer-red dark:hover:text-gamer-neon font-sans font-medium transition-colors"
            >
              Catálogo
            </Link>

            <SearchBar />

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/catalogo">
                <Button variant="outline" className="hidden lg:flex" glow>
                  <span className="mr-2">Ver Ofertas</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 border-b border-black/5 dark:border-white/10 backdrop-blur-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              href="/"
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gamer-red dark:hover:text-gamer-neon"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gamer-red dark:hover:text-gamer-neon"
            >
              Catálogo
            </Link>
            <div className="pt-4">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/20 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:border-gamer-red dark:focus:border-gamer-neon outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
