import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_on_sale?: boolean;
  original_price?: number;
  discount_percentage?: number;
  sale_price?: number;
}

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured }: ProductCardProps) {
  return (
    <Link href={`/producto/${product.id}`} className="block h-full">
      <div className="group relative bg-white dark:bg-gamer-card rounded-xl border border-black/10 dark:border-white/5 hover:border-gamer-red dark:hover:border-gamer-neon/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gamer-red/10 dark:hover:shadow-gamer-neon/10 flex flex-col h-full cursor-pointer">
        {/* Image Container */}
        <div className="relative h-64 w-full bg-gray-100 dark:bg-white/5 overflow-hidden">
          {/* Offer Badge - Top Right */}
          {product.is_on_sale && product.discount_percentage && (
            <div className="absolute top-2 right-2 z-10 bg-gamer-red text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
              <span className="text-lg">-{product.discount_percentage}%</span>
            </div>
          )}
          <Image
            src={product.image_url || "/images/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category Badge - Bottom Left */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-black/80 text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/20 backdrop-blur-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col grow">
          <h3 className="font-display font-bold text-xl leading-tight mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-gamer-red dark:group-hover:text-gamer-neon transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto pt-4 flex items-end justify-between border-t border-black/5 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Precio Efectivo
              </span>
              {product.is_on_sale && product.sale_price ? (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-300 line-through">
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                  <span className="text-2xl font-bold text-gamer-red dark:text-gamer-neon dark:text-glow">
                    ${product.sale_price.toLocaleString("es-AR")}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white dark:text-glow">
                  ${product.price.toLocaleString("es-AR")}
                </span>
              )}
            </div>

            <Button variant="outline" className="px-3 pointer-events-none" glow>
              Ver
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
