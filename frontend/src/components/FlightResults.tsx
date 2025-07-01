import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight, Wifi, Coffee, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { format, parseISO } from 'date-fns';
import type { SearchParams } from "@/pages/FlightSearchResults";
import { apiGet } from "@/lib/api";

const amenityIcons = {
  wifi: Wifi,
  entertainment: Monitor,
  meals: Coffee,
};

// Airline logo mapping (add more as needed)
const airlineLogos: Record<string, string> = {
  'Emirates': '/assets/emirates-airlines-logo.png',
  'Qatar Airways': '/assets/qatar-ariways-logo.png',
  'Lufthansa': '/assets/lufthansa-airways-logo.jpg',
  'British Airways': '/assets/british-airways-logo.jpg',
  'SpiceJet': '/assets/spicejet-logo.png',
  'United Airlines': '/assets/united-airlines-logo.png',
  // Add more airline logo mappings here
};

// Add explicit props type
interface FlightResultsProps {
  searchParams: SearchParams;
}

// Helper to parse adults and children from passengers string
function parsePassengers(passengers: string | undefined) {
  let adults = 1, children = 0;
  if (passengers) {
    const adultMatch = passengers.match(/(\d+) Adult/);
    const childMatch = passengers.match(/(\d+) Child/);
    adults = adultMatch ? parseInt(adultMatch[1], 10) : 1;
    children = childMatch ? parseInt(childMatch[1], 10) : 0;
  }
  return { adults, children };
}

const FlightResults = ({ searchParams }: FlightResultsProps) => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { adults, children } = parsePassengers(searchParams.passengers);

  // Format dates for display
  let dateDisplay = '';
  if (searchParams.departureDate) {
    dateDisplay = format(parseISO(searchParams.departureDate), 'MMM d, yyyy');
    if (searchParams.tripType === 'round-trip' && searchParams.returnDate) {
      dateDisplay += ` - ${format(parseISO(searchParams.returnDate), 'MMM d, yyyy')}`;
    }
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      originCode: searchParams.from,
      destinationCode: searchParams.to,
      deptDate: searchParams.departureDate || "",
      cabinClass: searchParams.class ? searchParams.class.toUpperCase() : "",
      // Add more params as needed
    }).toString();
    fetch(`http://localhost:8080/AirVista/Flight/search?${params}`)
      .then(res => {
        if (res.status === 204) return [];
        if (!res.ok) throw new Error("Failed to fetch flights");
        return res.json();
      })
      .then(data => setFlights(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || "Failed to fetch flights"))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to) {
      setError("Please select both departure and arrival airports.");
      return;
    }
    setError("");
    // ...navigate logic
  };

  if (loading) return <div>Loading flights...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!flights.length) return (
    <div className="text-2xl font-bold text-blue-700 py-12">
      No flights found for {searchParams.from} to {searchParams.to}
      {searchParams.departureDate ? ` on ${searchParams.departureDate}` : ''}.
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {searchParams.from} to {searchParams.to} Flights
          </h2>
          <p className="text-gray-600 mt-1">
            {flights.length} flights found{dateDisplay ? ` • ${dateDisplay}` : ''}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Price (Low to High)</option>
            <option>Duration (Shortest)</option>
            <option>Departure Time</option>
            <option>Best Value</option>
          </select>
        </div>
      </div>

      {/* Flight List */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <Card key={flight.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Flight Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start space-x-4">
                    {/* Airline Logo */}
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {airlineLogos[flight.airline] ? (
                        <img
                          src={airlineLogos[flight.airline]}
                          alt={flight.airline + ' logo'}
                          className="w-10 h-10 object-contain"
                          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/placeholder.svg'; }}
                        />
                      ) : (
                        <span className="text-primary font-bold text-sm">{flight.airline[0]}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Airline and Flight Number */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {flight.airline}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {flight.flightNumber}
                        </span>
                        {flight.deal && (
                          <Badge
                            variant={
                              flight.deal === "Cheapest"
                                ? "destructive"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {flight.deal}
                          </Badge>
                        )}
                      </div>

                      {/* Flight Times and Route */}
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {format(parseISO(flight.deptTime), 'HH:mm')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {flight.originCode}
                          </div>
                        </div>

                        <div className="flex-1 flex items-center">
                          <div className="w-full relative">
                            <div className="h-px bg-gray-300 w-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white px-2">
                                <Plane className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {format(parseISO(flight.arrTime), 'HH:mm')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {flight.destinationCode}
                          </div>
                        </div>
                      </div>

                      {/* Duration and Stops */}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {flight.stops} stop{flight.stops !== 1 ? 's' : ''}
                        </div>
                        <div>{flight.cabinClass}</div>
                      </div>

                      {/* Amenities */}
                      <div className="flex items-center space-x-2 mt-2">
                        {(flight.amenities ?? []).map((amenity) => {
                          const IconComponent = amenityIcons[amenity];
                          return (
                            <div
                              key={amenity}
                              className="w-6 h-6 text-gray-400"
                              title={amenity}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Booking */}
                <div className="lg:col-span-2 flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{flight.price}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button className="px-8" onClick={() => navigate(`/booking/${flight.id}`, { state: { flight, adults, children } })}>Select Flight</Button>
                    <Dialog open={modalOpen && selectedFlight?.id === flight.id} onOpenChange={open => { setModalOpen(open); if (!open) setSelectedFlight(null); }}>
                      <DialogTrigger asChild>
                        <button className="text-sm text-primary hover:underline" onClick={() => { setSelectedFlight(flight); setModalOpen(true); }}>
                          View Details
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Flight Details</DialogTitle>
                        </DialogHeader>
                        <div className="mb-6">
                          <div className="text-lg font-semibold mb-2">{flight.airline}</div>
                          {/* Route Line with Plane and Duration */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900">{format(parseISO(flight.deptTime), 'HH:mm')}</div>
                              <div className="text-sm text-gray-600">{flight.originCode}</div>
                            </div>
                            <div className="flex-1 flex flex-col items-center mx-2">
                              <div className="w-full relative flex items-center justify-center">
                                <div className="h-px bg-gray-300 w-full"></div>
                                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                                  <Plane className="w-5 h-5 text-primary mb-1" />
                                  <span className="text-xs text-gray-600 font-medium">{flight.stops} stop{flight.stops !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900">{format(parseISO(flight.arrTime), 'HH:mm')}</div>
                              <div className="text-sm text-gray-600">{flight.destinationCode}</div>
                            </div>
                          </div>
                          {/* Terminals */}
                          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-2">
                            <span className="text-gray-700">Departure Terminal: <span className="font-medium">T1</span></span>
                            <span className="text-gray-700">Arrival Terminal: <span className="font-medium">T3</span></span>
                          </div>
                          {/* Baggage Info Card */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between mb-4">
                            <div>
                              <div className="text-gray-700 font-medium mb-1">Checked Baggage: <span className="font-semibold">23kg included</span></div>
                              <div className="text-gray-700 font-medium">Cabin Baggage: <span className="font-semibold">7kg included</span></div>
                            </div>
                          </div>
                        </div>
                        {/* Cancellation Policy Dropdown */}
                        <div className="flex justify-between items-center gap-4 pt-4">
                          <div className="text-gray-900 text-xl font-bold">₹{flight.price}</div>
                          <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate(`/booking/${flight.id}`, { state: { flight, adults, children } })}>Book This Flight</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline" size="lg">
          Load More Flights
        </Button>
      </div>
    </div>
  );
};

// Helper component for cancellation policy
function CancellationPolicy() {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-2">
      <button
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        onClick={() => setShow((prev) => !prev)}
      >
        <span className="font-medium">Cancellation Policy</span>
        <span>{show ? "▲" : "▼"}</span>
      </button>
      {show && (
        <div className="bg-gray-50 border border-gray-200 rounded-b px-4 py-3 text-gray-700 text-sm">
          <ul className="list-disc pl-5">
            <li>Free cancellation within 24 hours of booking.</li>
            <li>After 24 hours, a cancellation fee of $50 applies.</li>
            <li>No refund for cancellations within 2 hours of departure.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// NOTE: API fetches are currently mocked. Connect to backend endpoints after frontend is complete.

export default FlightResults;
