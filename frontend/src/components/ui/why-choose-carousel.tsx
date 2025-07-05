"use client";
import { useState, useEffect, useRef } from "react";
import { FaCalendarCheck, FaHeadphones, FaTag, FaLock, FaGlobe } from "react-icons/fa";

const features = [
    {
        icon: <FaCalendarCheck className="text-3xl text-purple-500 mb-4" />,
        title: "Easy Booking",
        desc: "Book your flights in just a few clicks with our user-friendly platform.",
    },
    {
        icon: <FaHeadphones className="text-3xl text-purple-500 mb-4" />,
        title: "24/7 Support",
        desc: "Our customer support team is available around the clock to assist you.",
    },
    {
        icon: <FaTag className="text-3xl text-purple-500 mb-4" />,
        title: "Best Price Guarantee",
        desc: "We offer the best prices for flights to destinations worldwide.",
    },
    {
        icon: <FaLock className="text-3xl text-purple-500 mb-4" />,
        title: "Secure Payments",
        desc: "Your payment information is encrypted and protected at all times.",
    },
    {
        icon: <FaGlobe className="text-3xl text-purple-500 mb-4" />,
        title: "Global Destinations",
        desc: "Fly to over 200+ destinations across the globe with AirVista.",
    },
];

export default function WhyChooseCarousel() {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrent((current + 1) % features.length);
        }, 3500);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [current]);

    const handlePrev = () => {
        setCurrent((prev) => (prev - 1 + features.length) % features.length);
    };
    const handleNext = () => {
        setCurrent((prev) => (prev + 1) % features.length);
    };

    // Get indices for prev, current, next
    const prevIdx = (current - 1 + features.length) % features.length;
    const nextIdx = (current + 1) % features.length;

    return (
        <div className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center h-[320px]">
                {/* Left Arrow */}
                <button
                    onClick={handlePrev}
                    className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white z-20 shadow-xl border-2 border-purple-400/20 transition-all duration-300 hover:scale-110"
                    aria-label="Previous"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto my-auto">
                        <path d="M15.5 19L9.5 12L15.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                {/* Cards */}
                <div className="flex w-full items-center justify-center h-full relative">
                    {/* Previous card (left, back, upper, arc) */}
                    <div
                        className="absolute left-0 top-1/2 w-60 h-60 bg-gradient-to-br from-[#1D1F2F] to-[#2A1B3D] rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center opacity-60 z-0 transition-all duration-500 border border-purple-500/20"
                        style={{
                            transform: "translateY(-20%) scale(0.75) translateX(-70%)",
                            filter: "blur(2px)",
                            boxShadow: "0 8px 32px 0 rgba(147, 51, 234, 0.2)",
                        }}
                    >
                        {features[prevIdx].icon}
                        <h3 className="text-lg font-semibold mb-2 text-white">{features[prevIdx].title}</h3>
                        <p className="text-purple-200 text-sm px-4">{features[prevIdx].desc}</p>
                    </div>
                    {/* Main card */}
                    <div
                        className="relative w-72 h-72 bg-gradient-to-br from-[#1D1F2F] via-[#2A1B3D] to-[#1D1F2F] rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center z-10 scale-100 transition-all duration-500 border border-purple-500/30 backdrop-blur-sm"
                        style={{
                            boxShadow: "0 20px 60px 0 rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            transform: "translateY(0) scale(1)",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl"></div>
                        {features[current].icon}
                        <h3 className="text-xl font-bold mb-3 text-white relative z-10">{features[current].title}</h3>
                        <p className="text-purple-200 text-base px-6 relative z-10 leading-relaxed">{features[current].desc}</p>
                    </div>
                    {/* Next card (right, back, upper, arc) */}
                    <div
                        className="absolute right-0 top-1/2 w-60 h-60 bg-gradient-to-br from-[#1D1F2F] to-[#2A1B3D] rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center opacity-60 z-0 transition-all duration-500 border border-purple-500/20"
                        style={{
                            transform: "translateY(-20%) scale(0.75) translateX(70%)",
                            filter: "blur(2px)",
                            boxShadow: "0 8px 32px 0 rgba(147, 51, 234, 0.2)",
                        }}
                    >
                        {features[nextIdx].icon}
                        <h3 className="text-lg font-semibold mb-2 text-white">{features[nextIdx].title}</h3>
                        <p className="text-purple-200 text-sm px-4">{features[nextIdx].desc}</p>
                    </div>
                </div>
                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white z-20 shadow-xl border-2 border-purple-400/20 transition-all duration-300 hover:scale-110"
                    aria-label="Next"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto my-auto">
                        <path d="M8.5 5L14.5 12L8.5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            {/* Curved Rectangle Indicators */}
            <div className="flex justify-center mt-8 gap-3">
                {features.map((_, idx) => (
                    <button
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            idx === current 
                                ? "w-8 bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg" 
                                : "w-4 bg-purple-300/30 hover:bg-purple-300/50"
                        }`}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
} 