"use client";
import { Carousel } from "@/components/ui/carousel";

const slideData = [
  {
    title: "Bahamas",
    src: "/assets/bahamas.jpeg",
  },
  {
    title: "Bali",
    src: "/assets/trip-location-img2.jpg",
  },
  {
    title: "France",
    src: "/assets/trip-location-img3.jpg",
  },
  {
    title: "Singapore (Marina Bay Sands)",
    src: "/assets/trip-location-img4.jpg",
  },
  {
    title: "Manali",
    src: "/assets/manali.jpg",
  },
  {
    title: "Barcelona",
    src: "/assets/barcelona.jpg",
  },
];

export default function PopularDestinations() {
  return (
    <section className="py-16 bg-[#2a133d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Popular Destinations
        </h2>
        <div className="flex justify-center">
          <Carousel slides={slideData} />
        </div>
      </div>
    </section>
  );
}
