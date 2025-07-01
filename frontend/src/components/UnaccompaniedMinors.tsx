import { Card, CardContent } from "@/components/ui/card";
import { Users, Phone, CreditCard, Clock } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Help Through The Airport",
    description:
      "Our dedicated staff will guide your child through check-in, security, and boarding, ensuring a safe and smooth airport experience from start to finish.",
  },
  {
    icon: Phone,
    title: "Priority Boarding",
    description:
      "Unaccompanied minors receive priority boarding, allowing them extra time to settle in and get comfortable before takeoff.",
  },
  {
    icon: CreditCard,
    title: "Care On The Flight",
    description:
      "Our attentive crew provides personalized care, meals, and entertainment to keep your child comfortable and happy throughout the journey.",
  },
  {
    icon: Clock,
    title: "Assistance When They Land",
    description:
      "Upon arrival, our team assists your child through baggage claim and safely hands them over to the designated guardian.",
  },
];

const UnaccompaniedMinors = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Unaccompanied Minors
              <br />
              <span className="text-primary">Lounge</span>
            </h2>

            {/* Services Grid */}
            <div className="space-y-6">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-none bg-transparent"
                >
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="space-y-4">
              {/* Top image */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80"
                  alt="Flight attendants helping passengers"
                  className="w-full h-64 object-cover"
                />
              </div>
              {/* Bottom image */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&q=80"
                  alt="Children in airplane cabin"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnaccompaniedMinors;
