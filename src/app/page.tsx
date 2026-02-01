import { HomeBanners } from "@/components/ui/HomeBanners";
import { FeaturedProducts } from "@/components/ui/FeaturedProducts";
import Link from "next/link";
import { Zap, Shield, Headphones, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gamer-dark">
      {/* Hero Banner */}
      <HomeBanners />

      {/* CTA Section - Ofertas */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-r from-gamer-red to-red-700 dark:from-gamer-neon dark:to-cyan-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-sm uppercase tracking-wider">
            Ofertas Exclusivas
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
            ARMÁ TU PC GAMER
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Los mejores componentes al mejor precio. Financiación disponible.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gamer-red dark:text-gamer-neon font-bold rounded-lg hover:scale-105 transition-transform shadow-xl"
          >
            Ver Productos
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-1">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedProducts />
          <div className="mb-8 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Ver Todo el Catálogo
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gaming Experience Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gamer-red rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Experiencia Gamer Completa
            </h2>
            <p className="text-xl text-gray-300">
              Todo lo que necesitás para llevar tu gaming al siguiente nivel
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-gamer-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gamer-red/20 text-gamer-red mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Alto Rendimiento</h3>
                <p className="text-gray-300">
                  Componentes de última generación para máximo FPS y cero lag
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-purple-600/20 text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  <Shield size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Garantía Total</h3>
                <p className="text-gray-300">
                  Todos nuestros productos con garantía oficial del fabricante
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-cyan-600/20 text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  <Headphones size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Asesoramiento Pro</h3>
                <p className="text-gray-300">
                  Te ayudamos a elegir el setup perfecto para tu estilo de juego
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-100 dark:bg-black/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            ¿Listo para mejorar tu setup?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Explorá nuestro catálogo completo y encontrá todo lo que necesitás
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gamer-red dark:bg-gamer-neon text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Ver Catálogo Completo
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://wa.me/543816198344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultá por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
