import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

const destinations = [
  {
    id: 1,
    title: "Paris",
    location: "France",
    rating: 4.9,
    price: 299,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80", // Eiffel Tower
  },
  {
    id: 2,
    title: "Tokyo",
    location: "Japan",
    rating: 4.8,
    price: 349,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80", // Tokyo cityscape
  },
  {
    id: 3,
    title: "New York",
    location: "USA",
    rating: 4.7,
    price: 399,
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80", // NYC skyline
  },
];

const PopularDestinations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-muted-foreground mb-2 tracking-wider uppercase">
            TRAVEL SUPPORT
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Destination
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find Help With Your Booking And Travel Plans, And See What To Expect
            Along Your Journey.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="group cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rating Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white/90">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {destination.rating}
                  </Badge>
                </div>
                {/* Price Badge */}
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-primary text-white">
                    ${destination.price}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {destination.title}
                </h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{destination.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
