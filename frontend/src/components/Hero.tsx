import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find And Book
              <br />
              <span className="text-primary">A Great Experience</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              AirVista connects you to the world's best destinations with seamless booking, personalized service, and unbeatable prices. Start your next adventure with confidence and comfort—wherever you want to go, we'll get you there.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => {
              window.scrollTo({
                top: document.getElementById('booking-form')?.offsetTop || 0,
                behavior: 'smooth',
              });
            }}>
              Book A Trip Now
            </Button>
          </div>

          {/* Right Content - Airplane */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
                alt="Commercial airplane"
                className="w-full h-auto object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* Floating Info Card */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-20 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Know More</div>
                  <div className="text-sm font-semibold text-gray-900">
                    Discover The World One Adventure At
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Time!
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
