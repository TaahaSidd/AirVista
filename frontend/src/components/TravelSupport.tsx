import { motion } from "motion/react";
import { WorldMap } from "./ui/world-map";

// Use real cities on land for accurate map points
const route = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco (US West Coast)
  { lat: -23.5505, lng: -46.6333 }, // São Paulo (South America)
  { lat: 6.5244, lng: 3.3792 }, // Lagos (Africa)
  { lat: 51.5074, lng: -0.1278 }, // London (Europe)
  { lat: 24.7136, lng: 46.6753 }, // Riyadh (above Saudi)
  { lat: 28.6139, lng: 77.2090 }, // Delhi (above India)
  { lat: -33.8688, lng: 151.2093 }, // Sydney (Australia)
];

// Generate lines between consecutive cities
const dots = route.slice(0, -1).map((city, i) => ({
  start: city,
  end: route[i + 1],
}));

const TravelSupport = () => {
  return (
    <section className="py-16 bg-[#2a133d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
          >
            <div className="text-sm font-medium text-purple-300 mb-2 tracking-wider uppercase">
              EXPLORE THE WORLD
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fly Anywhere With AirVista
            </h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Discover destinations across the globe and experience seamless travel with our comprehensive flight booking platform.
            </p>
          </motion.div>
        </div>

        {/* World Map */}
        <div className="flex items-center justify-center w-full h-[40rem] relative">
          <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-[#2a133d] z-40" />
          <div className="absolute w-full h-full z-10">
            <WorldMap
              lineColor="#8b5cf6"
              dots={dots}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelSupport;
