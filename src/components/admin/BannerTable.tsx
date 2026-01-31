"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (id: string, currentState: boolean) => void;
}

export function BannerTable({
  banners,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerTableProps) {
  if (banners.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No hay banners creados. Crea uno para empezar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-xl overflow-hidden hover:border-gamer-red/30 transition-colors"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Image Preview */}
            <div className="relative aspect-[3/1] md:col-span-1 bg-gray-100 dark:bg-black/30 rounded-lg overflow-hidden">
              {banner.image_url && (
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                    {banner.title}
                  </h3>
                  <button
                    onClick={() => onToggleActive(banner.id, banner.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      banner.is_active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {banner.is_active ? (
                      <>
                        <Eye size={12} />
                        Activo
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} />
                        Inactivo
                      </>
                    )}
                  </button>
                </div>
                {banner.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {banner.description}
                  </p>
                )}
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gamer-red hover:underline"
                  >
                    {banner.link_url}
                  </a>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Orden: {banner.display_order}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(banner)}
                  className="flex-1"
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(banner.id, banner.title)}
                  className="flex-1 text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 size={16} className="mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
