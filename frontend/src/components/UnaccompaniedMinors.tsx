import { Card, CardContent } from "@/components/ui/card";
import { Users, Phone, CreditCard, Clock, Shield, Heart, Star, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Safe & Secure Travel",
    description:
      "Our dedicated staff ensures your child's safety throughout their journey with comprehensive supervision and care.",
  },
  {
    icon: Users,
    title: "Expert Airport Assistance",
    description:
      "Professional guidance through check-in, security, and boarding with priority handling for a stress-free experience.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description:
      "Attentive crew provides meals, entertainment, and comfort to keep your child happy and relaxed during the flight.",
  },
  {
    icon: CheckCircle,
    title: "Seamless Handover",
    description:
      "Safe arrival assistance with baggage claim and secure handover to designated guardians at destination.",
  },
];

const features = [
  "Priority boarding and seating",
  "24/7 flight tracking",
  "Real-time updates to parents",
  "Special meals and entertainment",
  "Medical assistance if needed",
  "Secure documentation handling"
];

const UnaccompaniedMinors = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2a133d] via-[#1a0b2e] to-[#2a133d] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/20 mb-6">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-purple-200 text-sm font-medium">Specialized Service</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Unaccompanied Minors
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Safe Travel Program
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Ensuring your child's safety and comfort with our comprehensive unaccompanied minor service,
            providing peace of mind for parents and a memorable journey for young travelers.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-2xl border border-purple-400/30">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-purple-100 text-lg">Safety Rate</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-2xl border border-purple-400/30">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-purple-100 text-lg">Support Available</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-2xl border border-purple-400/30">
            <div className="text-4xl font-bold text-white mb-2">200+</div>
            <div className="text-purple-100 text-lg">Destinations</div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Our Comprehensive Care Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="border border-purple-500/20 bg-gradient-to-r from-black/40 to-purple-900/20 backdrop-blur-sm hover:from-black/60 hover:to-purple-900/40 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-purple-200 leading-relaxed text-lg">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-3xl p-8 border border-purple-500/20">
            <h4 className="text-2xl font-semibold text-white mb-8 text-center flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              What's Included in Your Service
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-purple-200 text-lg bg-black/20 rounded-xl p-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-3xl p-12 border border-purple-500/20">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Book Your Child's Safe Journey?
            </h3>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto text-lg">
              Contact our specialized team to arrange unaccompanied minor travel with complete peace of mind.
              Our experts are here to ensure a safe and comfortable journey for your child.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg">
                Book Unaccompanied Minor Service
              </button>
              <button className="border-2 border-purple-500 text-purple-300 hover:text-white hover:bg-purple-500/20 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnaccompaniedMinors;
