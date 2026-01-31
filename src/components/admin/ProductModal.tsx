"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Product {
  id?: string;
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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: () => void;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "Hardware",
    image_url: "",
    is_on_sale: false,
    original_price: 0,
    discount_percentage: 0,
    sale_price: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      // Check if category exists in allCategories (will be populated by the fetch effect)
      // We'll handle this in the second useEffect after categories are loaded
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "Hardware",
        image_url: "",
        is_on_sale: false,
        original_price: 0,
        discount_percentage: 0,
        sale_price: 0,
      });
      setCustomCategory("");
      setShowCustomCategory(false);
    }
  }, [product, isOpen]);

  // Load existing categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase.from("products").select("category");
        if (data) {
          const uniqueCategories = [
            ...new Set(data.map((p) => p.category)),
          ] as string[];
          // Combine predefined and custom categories
          const combined = [
            ...predefinedCategories,
            ...uniqueCategories.filter(
              (cat) => !predefinedCategories.includes(cat),
            ),
          ];
          setAllCategories(combined);

          // After loading categories, check if editing product has custom category
          if (product && !combined.includes(product.category)) {
            setCustomCategory(product.category);
            setShowCustomCategory(true);
          } else {
            setShowCustomCategory(false);
            setCustomCategory("");
          }
        } else {
          setAllCategories(predefinedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAllCategories(predefinedCategories);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, product]);

  // Auto-calculate sale_price when price or discount changes
  useEffect(() => {
    const discount = formData.discount_percentage || 0;
    if (formData.is_on_sale && discount > 0) {
      const discountAmount = (formData.price * discount) / 100;
      const calculatedSalePrice = formData.price - discountAmount;
      setFormData((prev) => ({
        ...prev,
        sale_price: Math.round(calculatedSalePrice),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        sale_price: 0,
      }));
    }
  }, [formData.price, formData.discount_percentage, formData.is_on_sale]);

  const predefinedCategories = [
    "Hardware",
    "Periféricos",
    "Monitores",
    "Sillas",
    "Otros",
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      alert("Error subiendo imagen!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (formData.price <= 0) {
      alert("El precio debe ser mayor a 0.");
      return;
    }
    if (formData.stock < 0) {
      alert("El stock no puede ser negativo.");
      return;
    }

    try {
      if (product?.id) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", product.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("products").insert([formData]);
        if (error) throw error;
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error al guardar el producto");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto dark:box-glow transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red dark:focus:border-gamer-red"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData({
                        ...formData,
                        price: value >= 0 ? value : 0,
                      });
                    }}
                    className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red dark:focus:border-gamer-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData({
                        ...formData,
                        stock: value >= 0 ? value : 0,
                      });
                    }}
                    className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red dark:focus:border-gamer-red"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {allCategories.length > 0
                    ? allCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
                            setShowCustomCategory(false);
                            setCustomCategory("");
                          }}
                          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                            formData.category === cat && !showCustomCategory
                              ? "bg-gamer-red text-white ring-2 ring-gamer-red ring-offset-2 dark:ring-offset-gamer-dark"
                              : "bg-gray-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black/50 border border-black/10 dark:border-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      ))
                    : predefinedCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
                            setShowCustomCategory(false);
                            setCustomCategory("");
                          }}
                          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                            formData.category === cat && !showCustomCategory
                              ? "bg-gamer-red text-white ring-2 ring-gamer-red ring-offset-2 dark:ring-offset-gamer-dark"
                              : "bg-gray-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black/50 border border-black/10 dark:border-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                </div>
                {!showCustomCategory ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(true)}
                    className="w-full px-3 py-2 text-xs sm:text-sm text-gamer-red border border-gamer-red rounded-lg hover:bg-gamer-red/10 transition-colors"
                  >
                    + Crear categoría personalizada
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Nombre de categoría..."
                      className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-gamer-red"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (customCategory.trim()) {
                            const trimmedCategory = customCategory.trim();
                            setFormData({
                              ...formData,
                              category: trimmedCategory,
                            });
                            // Add to allCategories if not already present
                            if (!allCategories.includes(trimmedCategory)) {
                              setAllCategories([
                                ...allCategories,
                                trimmedCategory,
                              ]);
                            }
                            setShowCustomCategory(false);
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        ✓ Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategory(false);
                          setCustomCategory("");
                          setFormData({ ...formData, category: "Hardware" });
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Imagen
              </label>
              <div className="relative aspect-square bg-gray-100 dark:bg-black/50 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center overflow-hidden group hover:border-gamer-red transition-colors">
                {formData.image_url ? (
                  <>
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-sm font-bold">
                        Cambiar Imagen
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-400">
                      Click para subir
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>
              {uploading && (
                <p className="text-xs text-gamer-red dark:text-gamer-neon text-center animate-pulse">
                  Subiendo...
                </p>
              )}
            </div>
          </div>

          {/* Offer/Discount Section */}
          <div className="border-t border-black/10 dark:border-white/10 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Ofertas y Descuentos
            </h3>

            <div className="space-y-4">
              {/* Is On Sale Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/30 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Producto en Oferta
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Activá para mostrar este producto como oferta
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newIsOnSale = !formData.is_on_sale;
                    setFormData({
                      ...formData,
                      is_on_sale: newIsOnSale,
                      // Auto-fill original_price with current price when enabling sale
                      original_price:
                        newIsOnSale && !formData.original_price
                          ? formData.price
                          : formData.original_price,
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_on_sale
                      ? "bg-gamer-red"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_on_sale ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Discount Fields - Only show when is_on_sale is true */}
              {formData.is_on_sale && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Precio Original
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.original_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          original_price: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                      % de Descuento
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percentage: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red dark:focus:border-gamer-red h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" glow disabled={uploading}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
