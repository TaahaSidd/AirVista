import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, FileText } from "lucide-react";

const TravelSupport = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-muted-foreground mb-2 tracking-wider uppercase">
            TRAVEL SUPPORT
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Plan Your Travel With Confidence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find Help With Your Booking And Travel Plans, And See What To Expect
            Along Your Journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Travel Requirements For Dubai */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Travel Requirements For Dubai
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Stay updated on the latest travel requirements for Dubai, including visa policies, COVID-19 guidelines, and airport procedures to ensure a hassle-free journey.
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    SEE DETAILS
                  </Badge>
                </div>
              </div>
            </div>

            {/* Travel Requirements By Destination */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Travel Requirements By Destination
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Access up-to-date travel requirements for your destination, including entry restrictions, health protocols, and documentation needed for a smooth trip.
                  </p>
                </div>
              </div>
            </div>

            {/* Multi-Risk Travel Insurance */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Multi-Risk Travel Insurance
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Protect your trip with our comprehensive multi-risk travel insurance, covering medical emergencies, trip cancellations, lost baggage, and more for peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Large image */}
              <div className="col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
                  alt="Beach destination"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
              {/* Two smaller images */}
              <div>
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80"
                  alt="Mountain landscape"
                  className="w-full h-32 object-cover rounded-2xl"
                />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80"
                  alt="Countryside view"
                  className="w-full h-32 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelSupport;
