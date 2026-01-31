import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Initialize Supabase Client directly for Server Component to avoid hook issues
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Revalidate this page every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: {
    id: string;
  };
}

// Generate Static Params for build time
export async function generateStaticParams() {
  try {
    const { data: products } = await supabase.from("products").select("id");
    return products?.map((p) => ({ id: p.id })) || [];
  } catch (error) {
    console.warn(
      "Could not generate static params (Supabase might be unavailable during build):",
      error,
    );
    return [];
  }
}

export default async function ProductPage({ params }: PageProps) {
  // Await params correctly for Next.js 15+ (App Router)
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  // WhatsApp message with product details and URL
  const productUrl = `https://compunor.com/producto/${product.id}`;
  const priceText =
    product.is_on_sale && product.sale_price
      ? `$${product.sale_price.toLocaleString("es-AR")} (${product.discount_percentage}% OFF)`
      : `$${product.price.toLocaleString("es-AR")}`;

  const whatsappMessage = encodeURIComponent(
    `Hola Compunor!\n\nEstoy interesado en comprar:\n\nProducto: ${product.name}\nPrecio: ${priceText}\nCategoria: ${product.category}\n\nLink del producto:\n${productUrl}\n\nEsta disponible? Cuales son las opciones de pago y envio?`,
  );
  const whatsappLink = `https://wa.me/543816198344?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gamer-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gamer-red dark:hover:text-gamer-neon transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Volver al Catálogo</span>
        </Link>

        {/* Product Detail Card */}
        <div className="bg-white dark:bg-gamer-card rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Left Column - Image */}
            <div className="relative">
              <div className="sticky top-8">
                {/* Discount Badge */}
                {product.is_on_sale && product.discount_percentage && (
                  <div className="absolute top-4 right-4 z-10 bg-gamer-red text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                    <div className="text-2xl font-black">
                      -{product.discount_percentage}%
                    </div>
                    <div className="text-xs uppercase tracking-wide">
                      Descuento
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 dark:bg-black/20 rounded-xl overflow-hidden border border-black/5 dark:border-white/5">
                  <Image
                    src={product.image_url || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-black/30 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10">
                  <Tag size={16} />
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check size={20} className="font-bold" />
                    <span className="font-semibold">
                      Stock disponible: {product.stock} unidades
                    </span>
                  </div>
                ) : (
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    Sin stock
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black/20 dark:to-black/40 rounded-xl p-6 mb-6 border border-black/5 dark:border-white/5">
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Precio Efectivo
                </div>
                {product.is_on_sale && product.sale_price ? (
                  <div>
                    <div className="text-2xl text-gray-400 line-through mb-1">
                      ${product.price.toLocaleString("es-AR")}
                    </div>
                    <div className="text-5xl font-black text-gamer-red dark:text-gamer-neon">
                      ${product.sale_price.toLocaleString("es-AR")}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-2">
                      ¡Ahorrás $
                      {(product.price - product.sale_price).toLocaleString(
                        "es-AR",
                      )}
                      !
                    </div>
                  </div>
                ) : (
                  <div className="text-5xl font-black text-gray-900 dark:text-white">
                    ${product.price.toLocaleString("es-AR")}
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && product.description.trim() ? (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Descripción
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-center italic">
                    Consultá por más detalles del producto vía WhatsApp
                  </p>
                </div>
              )}

              {/* WhatsApp Button */}
              <div className="mt-auto">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg"
                    glow
                  >
                    <MessageCircle size={24} className="mr-3" />
                    Comprar por WhatsApp
                  </Button>
                </a>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Te redireccionará a nuestro chat para coordinar el pago y
                  envío.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-black/20 px-6 md:px-10 py-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gamer-card rounded-lg border border-black/5 dark:border-white/5">
                  <ShieldCheck
                    size={24}
                    className="text-gamer-red dark:text-gamer-neon"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Garantía Asegurada
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprá con confianza
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gamer-card rounded-lg border border-black/5 dark:border-white/5">
                  <Truck
                    size={24}
                    className="text-gamer-red dark:text-gamer-neon"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Envíos a todo el país
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Consultar costos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
