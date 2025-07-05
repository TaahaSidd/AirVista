"use client";
import WhyChooseCarousel from "@/components/ui/why-choose-carousel";

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-[#2a133d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Why Choose Us
        </h2>
        <WhyChooseCarousel />
      </div>
    </section>
  );
}
