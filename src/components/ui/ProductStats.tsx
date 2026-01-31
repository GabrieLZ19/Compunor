"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Layers, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

const stats = [
  {
    icon: Package,
    label: "Productos",
    value: 0,
    suffix: "+",
    color: "text-gamer-red",
  },
  {
    icon: Layers,
    label: "Categorías",
    value: 0,
    suffix: "",
    color: "text-gamer-neon",
  },
  {
    icon: TrendingUp,
    label: "Años",
    value: 5,
    suffix: "+",
    color: "text-blue-500",
  },
  {
    icon: Users,
    label: "Clientes",
    value: 500,
    suffix: "+",
    color: "text-purple-500",
  },
];

export function ProductStats() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get product count
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        if (count) setProductCount(count);

        // Get unique categories
        const { data } = await supabase.from("products").select("category");

        if (data) {
          const uniqueCategories = new Set(data.map((p) => p.category));
          setCategoryCount(uniqueCategories.size);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  const displayStats = stats.map((stat) => {
    if (stat.label === "Productos") return { ...stat, value: productCount };
    if (stat.label === "Categorías") return { ...stat, value: categoryCount };
    return stat;
  });

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-gamer-red/5 dark:via-gamer-neon/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-white dark:bg-gamer-card rounded-xl border border-black/10 dark:border-white/10 hover:border-gamer-red dark:hover:border-gamer-neon transition-all duration-300 hover:scale-105 shadow-sm dark:shadow-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`${stat.color} mb-3 flex justify-center`}>
                <stat.icon size={40} strokeWidth={1.5} />
              </div>
              <motion.div
                className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              >
                {stat.value}
                {stat.suffix}
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
