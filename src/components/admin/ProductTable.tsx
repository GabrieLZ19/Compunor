"use client";

import { Edit, Trash2, Package } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  is_on_sale?: boolean;
  original_price?: number;
  discount_percentage?: number;
  sale_price?: number;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-white/5 uppercase text-xs text-gray-600 dark:text-gray-400 font-bold tracking-wider">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 bg-gray-100 dark:bg-black rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                          {product.is_on_sale && (
                            <span className="px-2 py-0.5 bg-gamer-red text-white text-xs font-bold rounded">
                              OFERTA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.is_on_sale && product.sale_price ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price.toLocaleString()}
                        </span>
                        <span className="font-bold text-gamer-red dark:text-gamer-neon">
                          ${product.sale_price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-gamer-red dark:text-gamer-neon">
                        ${product.price.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-medium ${
                        product.stock > 5
                          ? "text-green-600 dark:text-green-400"
                          : product.stock > 0
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id, product.name)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    No hay productos cargados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-xl p-4 shadow-sm"
          >
            <div className="flex gap-3 mb-3">
              <div className="relative h-16 w-16 bg-gray-100 dark:bg-black rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">
                  {product.description}
                </p>
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 pb-3 border-b border-black/5 dark:border-white/5">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Precio
                </p>
                <p className="font-bold text-lg text-gamer-red dark:text-gamer-neon">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Stock
                </p>
                <p
                  className={`font-bold text-lg ${
                    product.stock > 5
                      ? "text-green-600 dark:text-green-400"
                      : product.stock > 0
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {product.stock}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => onDelete(product.id, product.name)}
                className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No hay productos cargados aún.
          </div>
        )}
      </div>
    </>
  );
}
