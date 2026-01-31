"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Package, Zap, Shield } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-white dark:bg-gamer-dark">
      {/* Simple grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 bg-gamer-red/10 dark:bg-gamer-red/20 rounded-full mb-6">
            <span className="text-gamer-red text-sm font-bold uppercase tracking-wider">
              Hardware Gaming Premium
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Armá tu PC
            <br />
            <span className="text-gamer-red">Gamer Ideal</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Los mejores componentes de hardware, periféricos y accesorios gaming
            en Tucumán. Asesoramiento personalizado y garantía oficial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Link href="/catalogo">
              <Button className="w-full sm:w-auto text-lg px-8 py-4 bg-gamer-red hover:bg-gamer-red/90 text-white">
                Ver Catálogo
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/catalogo">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-4"
              >
                Ofertas
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gamer-red/10 dark:bg-gamer-red/20 rounded-lg mb-2">
                <Package className="text-gamer-red" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Envíos
                <br />
                Rápidos
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gamer-red/10 dark:bg-gamer-red/20 rounded-lg mb-2">
                <Shield className="text-gamer-red" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Garantía
                <br />
                Oficial
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gamer-red/10 dark:bg-gamer-red/20 rounded-lg mb-2">
                <Zap className="text-gamer-red" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Asesoramiento
                <br />
                Experto
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
