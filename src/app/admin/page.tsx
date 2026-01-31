"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductModal } from "@/components/admin/ProductModal";
import { BannerModal } from "@/components/admin/BannerModal";
import { BannerTable } from "@/components/admin/BannerTable";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Plus, LogOut, Package, Image as ImageIcon } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "banners">(
    "products",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [categories, setCategories] = useState<string[]>([]);

  // Product states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Banner states
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: "product" | "banner";
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        fetchProducts();
        fetchBanners();
      }
    };

    checkAuth();
  }, []);

  // Filter products and extract categories when products change
  useEffect(() => {
    if (!products.length) {
      setFilteredProducts([]);
      setCategories([]);
      return;
    }

    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category)),
    ).filter(Boolean) as string[];
    setCategories(uniqueCategories);

    // Apply filters
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "Todos") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsBannerModalOpen(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setItemToDelete({ id, name, type: "product" });
    setDeleteModalOpen(true);
  };

  const handleDeleteBanner = (id: string, title: string) => {
    setItemToDelete({ id, name: title, type: "banner" });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "product") {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", itemToDelete.id);
        if (error) throw error;
        fetchProducts();
      } else {
        const { error } = await supabase
          .from("banners")
          .delete()
          .eq("id", itemToDelete.id);
        if (error) throw error;
        fetchBanners();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error al eliminar");
    }
  };

  const handleToggleBannerActive = async (
    id: string,
    currentState: boolean,
  ) => {
    try {
      const { error } = await supabase
        .from("banners")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error("Error toggling banner:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gamer-red"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="text-gamer-red" />
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra tus productos, precios y stock en tiempo real.
          </p>
        </div>
        <Button onClick={handleSignOut} variant="ghost">
          <LogOut size={18} className="mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-black/10 dark:border-white/10">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === "products"
              ? "text-gamer-red border-b-2 border-gamer-red"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Package size={18} />
          Productos
        </button>
        <button
          onClick={() => setActiveTab("banners")}
          className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === "banners"
              ? "text-gamer-red border-b-2 border-gamer-red"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <ImageIcon size={18} />
          Banners
        </button>
      </div>

      {/* Content */}
      {activeTab === "products" ? (
        <>
          <div className="mb-6 space-y-4">
            {/* Search and Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar productos por nombre, descripción o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-gamer-red transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gamer-red transition-colors cursor-pointer"
                >
                  <option value="Todos">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results and Add Button */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} de {products.length} productos
              </p>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                glow
              >
                <Plus size={18} className="mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />

          <ProductModal
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }}
            product={editingProduct}
            onSave={fetchProducts}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {banners.length} banners en total
            </p>
            <Button
              onClick={() => {
                setEditingBanner(null);
                setIsBannerModalOpen(true);
              }}
              glow
            >
              <Plus size={18} className="mr-2" />
              Nuevo Banner
            </Button>
          </div>

          <BannerTable
            banners={banners}
            onEdit={handleEditBanner}
            onDelete={handleDeleteBanner}
            onToggleActive={handleToggleBannerActive}
          />

          <BannerModal
            isOpen={isBannerModalOpen}
            onClose={() => {
              setIsBannerModalOpen(false);
              setEditingBanner(null);
            }}
            banner={editingBanner}
            onSave={fetchBanners}
          />
        </>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ""}
      />
    </div>
  );
}
