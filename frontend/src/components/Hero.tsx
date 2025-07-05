import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

const PARALLAX_IMG = "/assets/network_communications_background_with_flowing_cyber_dots_1609.jpg";

const infoSlides = [
  {
    label: "Know More",
    title: "Discover The World One Adventure At",
    subtitle: "Time!",
    dots: ["purple-400", "purple-300", "yellow-400"],
    dotFills: ["primary", "purple-400", "yellow-400"],
  },
  {
    label: "Travel Smart",
    title: "Seamless Booking, Personalized Service",
    subtitle: "Best Prices!",
    dots: ["purple-300", "yellow-400", "purple-400"],
    dotFills: ["purple-400", "yellow-400", "primary"],
  },
  {
    label: "Adventure Awaits",
    title: "Explore New Destinations With Us",
    subtitle: "Book Now!",
    dots: ["yellow-400", "purple-400", "purple-300"],
    dotFills: ["yellow-400", "primary", "purple-400"],
  },
];

const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

const colorClass = (color: string) => {
  switch (color) {
    case "purple-400": return "bg-purple-400";
    case "purple-300": return "bg-purple-300";
    case "yellow-400": return "bg-yellow-400";
    case "primary": return "bg-primary";
    default: return "";
  }
};

const Hero = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [slide, setSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      setOffset({ x, y });
    };
    const node = heroRef.current;
    if (node) node.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (node) node.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % infoSlides.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [slide]);

  // Parallax transform: max 30px in any direction
  const parallaxStyle = {
    transform: `translate3d(${offset.x * 35}px, ${offset.y * 35}px, 0) scale(1.08)`,
    transition: "transform 0.2s cubic-bezier(.25,.46,.45,.94)",
  };

  // Carousel logic
  const current = infoSlides[slide];
  const nextSlide = () => setSlide((slide + 1) % infoSlides.length);
  const goToSlide = (idx: number) => setSlide(idx);

  return (
    <section ref={heroRef} className="relative bg-black overflow-hidden min-h-[600px] flex items-center">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          ...parallaxStyle,
          backgroundImage: `url('${PARALLAX_IMG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
          filter: "blur(2px)",
        }}
      />
      {/* Overlay for subtle white gradient - removed */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find And Book
              <br />
              <span className="text-primary">A Great Experience</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg">
              AirVista connects you to the world's best destinations with seamless booking, personalized service, and unbeatable prices. Start your next adventure with confidence and comfort—wherever you want to go, we'll get you there.
            </p>
            <Button
              size="lg"
              className="relative overflow-hidden animated-gradient-border bg-primary hover:bg-primary/90"
              style={{ zIndex: 1 }}
              onClick={() => {
                window.scrollTo({
                  top: document.getElementById('booking-form')?.offsetTop || 0,
                  behavior: 'smooth',
                });
              }}
            >
              Book A Trip Now
            </Button>
          </div>

          {/* Right Content - Parallax Card Carousel */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={PARALLAX_IMG}
                alt="Parallax background"
                className="w-full h-auto object-cover rounded-lg shadow-2xl"
                style={{ opacity: 0 }} // Hide duplicate image, background is now parallax
              />
            </div>

            {/* Floating Info Card Carousel */}
            <div
              className="absolute bottom-4 right-4 bg-black/70 p-4 rounded-lg shadow-lg z-20 max-w-xs border border-white/10 cursor-pointer select-none"
              onClick={nextSlide}
              title="Click to see more info"
            >
              <div className="flex items-center space-x-3">
                {/* Dots */}
                <div className="flex space-x-2">
                  {current.dots.map((bg, i) => {
                    const isActive = slide === i;
                    return (
                      <div
                        key={i}
                        className={`
                          ${isActive ? "w-5 h-5" : "w-3.5 h-3.5"}
                          rounded-full flex items-center justify-center border-2
                          ${colorClass(bg)}
                          ${isActive ? "border-primary" : "border-transparent"}
                          cursor-pointer transition-all duration-200
                        `}
                        onClick={e => { e.stopPropagation(); goToSlide(i); }}
                      >
                        <div className={`
                          ${isActive ? "w-3 h-3" : "w-2 h-2"}
                          rounded-full
                          ${colorClass(current.dotFills[i])}
                          transition-all duration-200
                        `}></div>
                      </div>
                    );
                  })}
                </div>
                {/* Info Content */}
                <div>
                  <div className="text-xs text-purple-200">{current.label}</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-sm font-semibold text-white">
                        {current.title}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {current.subtitle}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
