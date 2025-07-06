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
import { ScrollArea } from "@/components/ui/scroll-area";

const amenityIcons = {
  wifi: Wifi,
  entertainment: Monitor,
  meals: Coffee,
};

// Airline logo mapping (add more as needed)
const airlineLogos: Record<string, string> = {
  'Emirates': 'emirates-airlines-logo.png',
  'Qatar Airways': 'qatar-ariways-logo.png',
  'Lufthansa': '/assets/lufthansa-airways-logo.jpg',
  'British Airways': 'british-airways-logo.jpg',
  'SpiceJet': 'spice-jet-logo.jpg',
  'United Airlines': 'united-airlines-logo.png',
  'Air India': 'air-india-logo.jpg',
  'Air France': '/assets/air-france-logo.png',
  'American Airlines': '/assets/american-airlines-logo.png',
  'Delta Airlines': '/assets/delta-airlines-logo.png',
  'Southwest Airlines': '/assets/southwest-airlines-logo.png',
  'Jet Airways': '/assets/jet-airways-logo.png',
  'AirAsia': '/assets/airasia-logo.jpg',
  'Vistara': 'vistara-alrlines-logo.jpg',
  'Air China': 'airchina-airlines-log.png',
  'EasyJet': 'easyjet-logo.png',
  // Add more airline logo mappings here
};

// Add explicit props type
type FlightResultsProps = {
  searchParams: SearchParams;
  priceRange: [number, number];
  selectedAirlines: string[];
  selectedStops: string[];
  selectedTimes: string[];
  durationRange: [number, number];
  showAll?: boolean;
  isShowAllMode?: boolean;
  maxHeightPx?: number;
  onShowAllClick?: () => void;
  showAllButtonLabel?: string;
  showAllButtonVariant?: string;
};

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

// Helper to calculate duration from two ISO strings
function calculateDuration(deptTime: string, arrTime: string) {
  if (!deptTime || !arrTime) return '—';
  const start = new Date(deptTime);
  const end = new Date(arrTime);
  const diffMs = end.getTime() - start.getTime();
  if (isNaN(diffMs) || diffMs < 0) return '—';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
}

const FlightResults = ({
  searchParams,
  priceRange,
  selectedAirlines,
  selectedStops,
  selectedTimes,
  durationRange,
  showAll = false,
  isShowAllMode = false,
  maxHeightPx,
  onShowAllClick,
  showAllButtonLabel,
  showAllButtonVariant
}: FlightResultsProps) => {
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

  // Helper to format time
  const formatTime = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'HH:mm');
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    if (showAll) {
      fetch(`http://localhost:8080/AirVista/Flight/getAll`)
        .then(res => {
          if (res.status === 204) return [];
          if (!res.ok) throw new Error("Failed to fetch flights");
          return res.json();
        })
        .then(data => setFlights(Array.isArray(data) ? data : []))
        .catch(err => setError(err.message || "Failed to fetch flights"))
        .finally(() => setLoading(false));
    } else {
      // Extract airport codes from 'City Name (CODE)'
      const extractCode = (str: string) => {
        const match = str.match(/\(([^)]+)\)/);
        return match ? match[1] : str;
      };
      const originCode = searchParams.from ? extractCode(searchParams.from) : '';
      const destinationCode = searchParams.to ? extractCode(searchParams.to) : '';
      const params = new URLSearchParams({
        originCode,
        destinationCode,
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
    }
  }, [searchParams, showAll]);

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

  // --- Frontend Filtering ---
  const filteredFlights = isShowAllMode
    ? flights // show all flights, no filtering
    : flights.filter(flight => {
    // Price filter
    if (flight.price < priceRange[0] || flight.price > priceRange[1]) return false;
    // Airline filter
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
    // Stops filter
    if (selectedStops.length > 0) {
      const stopsLabel =
        flight.stops === 0 ? "Non-stop" :
          flight.stops === 1 ? "1 Stop" : "2+ Stops";
      if (!selectedStops.includes(stopsLabel)) return false;
    }
    // Departure time filter (simple slot matching)
    if (selectedTimes.length > 0) {
      const hour = new Date(flight.deptTime).getHours();
      let slot = "";
      if (hour >= 6 && hour < 12) slot = "Early Morning";
      else if (hour >= 12 && hour < 18) slot = "Afternoon";
      else if (hour >= 18 && hour < 24) slot = "Evening";
      else slot = "Night";
      if (!selectedTimes.includes(slot)) return false;
    }
    // Duration filter (if available)
    if (durationRange && flight.duration) {
      // Assume duration is in format 'Xh Ym' or 'Xh'
      const match = /(?:(\d+)h)?\s*(?:(\d+)m)?/.exec(flight.duration);
      let mins = 0;
      if (match) {
        mins += match[1] ? parseInt(match[1]) * 60 : 0;
        mins += match[2] ? parseInt(match[2]) : 0;
      }
      const minMins = durationRange[0] * 60;
      const maxMins = durationRange[1] * 60;
      if (mins < minMins || mins > maxMins) return false;
    }
    return true;
  });

  // Calculate unique airline count
  const uniqueAirlines = Array.from(new Set(flights.map(f => f.airline))).length;

  const TopBar = () => (
    <div className="flex flex-row justify-between items-start mb-4 gap-4">
      <div className="flex-1 flex items-start">
        {isShowAllMode ? (
          <p className="text-gray-300 font-medium text-base md:text-lg">
            Showing all {filteredFlights.length} flights from {uniqueAirlines} airline{uniqueAirlines !== 1 ? 's' : ''}
          </p>
        ) : (
          <p className="text-gray-300 font-medium text-base md:text-lg">
            {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found from {uniqueAirlines} airline{uniqueAirlines !== 1 ? 's' : ''}{dateDisplay ? ` • ${dateDisplay}` : ''}
          </p>
        )}
        </div>
      <div className="flex items-start ml-auto">
        <Button
          variant={showAllButtonVariant as any}
          onClick={onShowAllClick}
          className="glassmorphic-bar border border-purple-500/30 bg-white/10 backdrop-blur-md shadow-md rounded-xl px-6 py-2 text-base font-semibold text-purple-200 hover:border-purple-400/50 hover:text-white transition"
          style={{ minWidth: 180 }}
        >
          {showAllButtonLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <TopBar />
      {/* Flight List in ScrollArea */}
      <div
        className="w-full overflow-y-auto pr-2"
        style={{ maxHeight: maxHeightPx ? `${maxHeightPx}px` : '85vh' }}
      >
        <div className="space-y-4">
          {filteredFlights.length === 0 ? (
            <div className="text-2xl font-bold text-blue-700 py-12 text-center">
              {/* No extra message, just empty space for consistency */}
            </div>
          ) : (
            filteredFlights.map((flight) => (
            <Card
              key={flight.id}
              className="relative z-10 bg-gradient-to-br from-[#1D1F2F]/80 via-[#2A1B3D]/80 to-[#1D1F2F]/80 border border-purple-500/30 rounded-2xl shadow-xl group overflow-hidden backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-[1.025] hover:shadow-2xl hover:shadow-purple-700/40 hover:border-purple-400/60 hover:ring-2 hover:ring-purple-400/30"
              style={{ boxShadow: "0 8px 32px 0 rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)" }}
            >
              <CardContent className="p-0 md:p-1">
                {/* Upper Section: Main Info */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center px-8 pt-8 pb-4 gap-8 border-b border-purple-500/20 bg-white/5">
                  {/* Left: Logo, Airline, Flight Number */}
                  <div className="flex items-center min-w-[180px] md:min-w-[220px]">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-purple-500/20 shadow-md mr-4">
                      {airlineLogos[flight.airline] ? (
                        <img
                          src={airlineLogos[flight.airline]}
                          alt={flight.airline + ' logo'}
                          className="w-14 h-14 object-cover rounded-xl"
                          style={{ aspectRatio: '1/1' }}
                          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/placeholder.svg'; }}
                        />
                      ) : (
                        <span className="text-primary font-bold text-lg">{flight.airline[0]}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-lg truncate">{flight.airline}</span>
                      <span className="text-purple-200 text-sm truncate">{flight.flightNumber}</span>
                      {flight.deal && (
                        <Badge
                          variant={flight.deal === "Cheapest" ? "destructive" : "default"}
                          className="text-xs px-2 py-0.5 border border-purple-500/40 bg-purple-700/30 text-purple-200 mt-1 w-fit"
                        >
                          {flight.deal}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Center: Route */}
                  <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="flex flex-col items-center md:items-end">
                        <div className="text-xl font-bold text-white">{formatTime(flight.deptTime)}</div>
                        <div className="text-xs text-purple-200 mt-1">{flight.originCode}</div>
                    </div>
                    <div className="relative flex items-center w-40 h-8 mx-2">
                      <div className="w-full border-t-2 border-dashed border-purple-500" style={{ height: '0' }} />
                      <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400 bg-transparent" style={{ background: 'transparent', boxShadow: 'none' }} />
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-xl font-bold text-white">{formatTime(flight.arrTime)}</div>
                        <div className="text-xs text-purple-200 mt-1">{flight.destinationCode}</div>
                    </div>
                  </div>
                  {/* Right: Duration, Stops, Price, Actions */}
                  <div className="flex flex-col items-end min-w-[160px] md:min-w-[200px] gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-300 mr-1" />
                      <span className="text-sm text-purple-200">{flight.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-300">{flight.stops === 0 ? 'Non-stop' : flight.stops === 1 ? '1 Stop' : `${flight.stops} Stops`}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold text-white">₹{flight.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="secondary" onClick={() => { setSelectedFlight(flight); setModalOpen(true); }}>View Details</Button>
                      <Button size="sm" onClick={() => navigate(`/booking/${flight.id}`, { state: { flight, adults, children } })}>Book Now</Button>
                    </div>
                  </div>
                </div>
                {/* Lower Section: Amenities */}
                <div className="flex flex-wrap items-center gap-4 px-8 py-3 bg-gradient-to-r from-purple-900/10 to-purple-800/5">
                  {flight.amenities && flight.amenities.map((amenity: string) => {
                    const Icon = amenityIcons[amenity.toLowerCase() as keyof typeof amenityIcons];
                    return Icon ? (
                      <span key={amenity} className="flex items-center gap-1 text-purple-300 text-xs font-medium bg-purple-900/10 px-2 py-1 rounded-full">
                        <Icon className="w-4 h-4" /> {amenity}
                      </span>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
      {/* View Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full glassmorphic-bar border border-purple-500/30 bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-0">
          {selectedFlight && (
            <div className="p-10 space-y-8">
              {/* Top Row: Title, Status */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-white mr-2">Flight Details</span>
                <span className="bg-yellow-200 text-yellow-800 text-sm font-semibold px-3 py-1 rounded shadow">{selectedFlight.flightStatus || 'Scheduled'}</span>
              </div>
              {/* Info Row */}
              <div className="grid grid-cols-4 gap-6 text-base text-purple-200 mb-6">
                <div className="flex flex-col"><span className="font-semibold text-purple-400 text-sm mb-1">Flight</span><span className="text-lg font-bold">{selectedFlight.flightNumber}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-purple-400 text-sm mb-1">Gate</span><span className="text-lg font-bold">{selectedFlight.depGate || '—'}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-purple-400 text-sm mb-1">Scheduled</span><span className="text-lg font-bold">{formatTime(selectedFlight.deptTime)}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-purple-400 text-sm mb-1">Travel time</span><span className="text-lg font-bold">{selectedFlight.duration || calculateDuration(selectedFlight.deptTime, selectedFlight.arrTime)}</span></div>
              </div>
              {/* Timeline Section */}
              <div className="flex flex-col gap-6">
                {/* Origin */}
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                  <div className="flex flex-col">
                    <span className="font-semibold text-purple-200 text-2xl">{selectedFlight.originCode}</span>
                    <span className="text-base text-purple-400">{formatTime(selectedFlight.deptTime)}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs text-purple-300">{selectedFlight.deptTime ? new Date(selectedFlight.deptTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : ''}</span>
                  </div>
                </div>
                {/* Center line with plane */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full h-0.5 bg-purple-900/30 relative mb-2 mt-2">
                    <Plane className="absolute left-1/2 -translate-x-1/2 -top-3 w-7 h-7 text-purple-400 bg-white/10 rounded-full shadow" />
                  </div>
                </div>
                {/* Destination */}
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={2} fill="none" /></svg>
                  <div className="flex flex-col">
                    <span className="font-semibold text-purple-200 text-2xl">{selectedFlight.destinationCode}</span>
                    <span className="text-base text-purple-400">{formatTime(selectedFlight.arrTime)}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs text-purple-300">{selectedFlight.arrTime ? new Date(selectedFlight.arrTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
