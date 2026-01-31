"use client";

import { useState, useEffect } from "react";
import { X, Upload, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Banner {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner | null;
  onSave: () => void;
}

export function BannerModal({
  isOpen,
  onClose,
  banner,
  onSave,
}: BannerModalProps) {
  const [formData, setFormData] = useState<Banner>({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    is_active: true,
    display_order: 0,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData(banner);
    } else {
      setFormData({
        title: "",
        description: "",
        image_url: "",
        link_url: "",
        is_active: true,
        display_order: 0,
      });
    }
  }, [banner, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Math.random()}.${fileExt}`;
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

    try {
      if (banner?.id) {
        // Update
        const { error } = await supabase
          .from("banners")
          .update(formData)
          .eq("id", banner.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("banners").insert([formData]);
        if (error) throw error;
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error al guardar el banner");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto dark:box-glow transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
            {banner ? "Editar Banner" : "Nuevo Banner"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Imagen del Banner (Recomendado: 1200x400px)
            </label>
            <div className="relative aspect-[3/1] bg-gray-100 dark:bg-black/50 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center overflow-hidden group hover:border-gamer-red transition-colors">
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
                    Click para subir imagen del banner
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
              <p className="text-xs text-gamer-red dark:text-gamer-neon text-center animate-pulse mt-2">
                Subiendo...
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                Link de Destino (Opcional)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                URL a la que redirige al hacer click en el banner. Ejemplo:
                /catalogo o https://ejemplo.com
              </p>
              <input
                type="text"
                value={formData.link_url}
                onChange={(e) =>
                  setFormData({ ...formData, link_url: e.target.value })
                }
                placeholder="/catalogo o https://ejemplo.com"
                className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red"
              />
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
              className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red h-20"
              placeholder="Descripción opcional del banner..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Orden de visualización
              </label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: Number(e.target.value),
                  })
                }
                className="w-full bg-gray-100 dark:bg-black/50 border border-transparent dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:border-gamer-red"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Estado
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.is_active
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                {formData.is_active ? (
                  <>
                    <Eye size={18} />
                    Activo
                  </>
                ) : (
                  <>
                    <EyeOff size={18} />
                    Inactivo
                  </>
                )}
              </button>
            </div>
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
