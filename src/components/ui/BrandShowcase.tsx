"use client";

export function BrandShowcase() {
  const brands = [
    { name: "AMD" },
    { name: "NVIDIA" },
    { name: "Intel" },
    { name: "Corsair" },
    { name: "Logitech" },
    { name: "Razer" },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gamer-dark/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h3 className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-8">
            Trabajamos con las mejores marcas
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center p-6 bg-white dark:bg-gamer-card rounded-lg border border-black/5 dark:border-white/5 hover:border-gamer-red/30 dark:hover:border-gamer-red/30 transition-colors group"
              >
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-700 dark:text-gray-300 group-hover:text-gamer-red dark:group-hover:text-gamer-neon transition-colors">
                    {brand.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
