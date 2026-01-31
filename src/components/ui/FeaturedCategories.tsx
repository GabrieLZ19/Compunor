import Link from "next/link";
import { Cpu, Monitor, Keyboard, Mouse } from "lucide-react";

const categories = [
  {
    name: "Hardware",
    icon: Cpu,
    color: "text-gamer-neon",
    description: "Procesadores, Placas de Video, Motherboards",
  },
  {
    name: "Periféricos",
    icon: Keyboard,
    color: "text-gamer-red",
    description: "Teclados, Mouses, Auriculares",
  },
  {
    name: "Monitores",
    icon: Monitor,
    color: "text-blue-400",
    description: "Monitores 144hz, IPS, Curvos",
  },
  {
    name: "Sillas",
    icon: Mouse,
    color: "text-purple-400",
    description: "Ergonomía y comodidad para largas sesiones",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16 text-gray-900 dark:text-white">
        CATEGORÍAS <span className="text-gamer-red">DESTACADAS</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/catalogo?category=${cat.name}`}
            className="group relative p-6 bg-white dark:bg-gamer-card rounded-xl border border-black/10 dark:border-white/5 hover:border-gamer-red dark:hover:border-gamer-neon/50 transition-all duration-300 hover:-translate-y-1 block shadow-sm dark:shadow-none"
          >
            <div
              className={`mb-4 ${cat.color} group-hover:scale-110 transition-transform duration-300`}
            >
              <cat.icon size={48} />
            </div>
            <h3 className="text-xl font-bold font-display mb-2 text-gray-900 dark:text-white dark:group-hover:text-glow">
              {cat.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {cat.description}
            </p>

            <div className="absolute inset-0 bg-linear-to-t from-gamer-red/5 dark:from-gamer-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
          </Link>
        ))}
      </div>
    </section>
  );
}
