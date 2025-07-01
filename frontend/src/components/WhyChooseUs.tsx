import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Headphones, Plane, DollarSign } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description:
      "We offer easy and convenient flight bookings with attractive deals.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our travel specialists are standing by 24/7 to search for, book and support your travel needs.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Plane,
    title: "Beyond Flights",
    description:
      "Find, book and manage your complete trip - from flights to hotels to tours. We're your one-stop-shop for booking the ultimate travel.",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: DollarSign,
    title: "Price Saver",
    description:
      "Our travel prices tracker monitors fluctuations in real time, and this your customers immediately two major changes.",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gray-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-20 h-20 border border-gray-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-gray-300 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border border-gray-300 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Airplane Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80"
              alt="Commercial airplane"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Why Choose Us
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <feature.icon
                          className={`w-6 h-6 ${feature.iconColor}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
