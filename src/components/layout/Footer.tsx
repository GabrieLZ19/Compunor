import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gamer-card border-t border-black/10 dark:border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display font-black text-2xl text-gray-900 dark:text-white mb-3">
              COMPUNOR
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Tu tienda de confianza para hardware gaming en Tucumán.
              Componentes de calidad, asesoramiento experto y los mejores
              precios.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/compunortucuman?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gamer-red hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/compunortucuman?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gamer-red hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-gamer-red transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-gray-600 dark:text-gray-400 hover:text-gamer-red transition-colors"
                >
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=LAPRIDA+636,+San+Miguel+de+Tucumán,+Argentina,+4000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-gamer-red transition-colors"
                >
                  LAPRIDA 636, San Miguel de Tucumán, Argentina, 4000
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <Phone size={18} className="mt-0.5 shrink-0" />
                <div className="flex flex-col text-sm">
                  <a
                    href="tel:+5493816198344"
                    className="hover:text-gamer-red transition-colors"
                  >
                    381 619-8344
                  </a>
                  <a
                    href="tel:+5493812177014"
                    className="hover:text-gamer-red transition-colors"
                  >
                    381 217-7014
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">info@compunor.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-black/10 dark:border-white/10 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Compunor. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
