import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, ChevronDown, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const airportDisplay: Record<string, string> = {
  dubai: "Dubai (DXB)",
  london: "London (LHR)",
  newyork: "New York (JFK)",
  paris: "Paris (CDG)",
  mumbai: "Mumbai (BOM)",
  delhi: "Delhi (DEL)",
  bangalore: "Bangalore (BLR)",
  chennai: "Chennai (MAA)"
};

// Set default dates dynamically
const today = new Date();
const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const defaultDeparture = formatDate(today);
const defaultReturn = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));

const BookingForm = () => {
  const [activeTab, setActiveTab] = useState("one-way");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [departureDate, setDepartureDate] = useState(defaultDeparture);
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [flightClass, setFlightClass] = useState("business");
  const navigate = useNavigate();
  const [airports, setAirports] = useState<{ id: number; name: string; code: string }[]>([]);
  const [error, setError] = useState("");
  const [fromDropdown, setFromDropdown] = useState(false);
  const [toDropdown, setToDropdown] = useState(false);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/AirVista/Airport")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error("Failed to fetch airports", err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromInput || !toInput) {
      setError("Please select both departure and arrival airports.");
      return;
    }
    setError("");
    navigate('/flight-search-results', {
      state: {
        searchParams: {
          from,
          to,
          departureDate,
          returnDate: activeTab === 'round-trip' ? returnDate : undefined,
          passengers: `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`,
          class: flightClass,
          tripType: activeTab,
        }
      }
    });
  };

  return (
    <section id="booking-form" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Custom Tab Implementation */}
            <form className="w-full" onSubmit={handleSearch}>
              {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-8 w-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("round-trip")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                    activeTab === "round-trip"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("one-way")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                    activeTab === "one-way"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                >
                  One-way
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("multi-city")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                    activeTab === "multi-city"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                >
                  Multi-City
                </button>
              </div>
              <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
                  {/* Departure Airport */}
                  <div className="space-y-2">
                    <Label htmlFor="from-airport" className="text-sm font-medium">Departure Airport</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        ref={fromInputRef}
                        id="from-airport"
                        type="text"
                        className="pl-10 w-full border rounded-md h-12"
                        placeholder="From (Type to search airport)"
                        value={fromInput}
                        onChange={e => {
                          setFromInput(e.target.value);
                          setFrom("");
                          setFromDropdown(true);
                        }}
                        onFocus={() => setFromDropdown(true)}
                        autoComplete="off"
                      />
                      {fromDropdown && fromInput && (
                        <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
                          {airports.filter(a =>
                            a.name.toLowerCase().includes(fromInput.toLowerCase()) ||
                            a.code.toLowerCase().includes(fromInput.toLowerCase())
                          ).map(a => (
                            <div
                              key={a.id}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => {
                                setFrom(a.code);
                                setFromInput(`${a.name} (${a.code})`);
                                setFromDropdown(false);
                              }}
                            >
                              {a.name} ({a.code})
                            </div>
                          ))}
                          {airports.filter(a =>
                            a.name.toLowerCase().includes(fromInput.toLowerCase()) ||
                            a.code.toLowerCase().includes(fromInput.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2 text-gray-500">No airports found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Arrival Airport */}
                  <div className="space-y-2">
                    <Label htmlFor="to-airport" className="text-sm font-medium">Arrival Airport</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        ref={toInputRef}
                        id="to-airport"
                        type="text"
                        className="pl-10 w-full border rounded-md h-12"
                        placeholder="To (Type to search airport)"
                        value={toInput}
                        onChange={e => {
                          setToInput(e.target.value);
                          setTo("");
                          setToDropdown(true);
                        }}
                        onFocus={() => setToDropdown(true)}
                        autoComplete="off"
                      />
                      {toDropdown && toInput && (
                        <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
                          {airports.filter(a =>
                            a.name.toLowerCase().includes(toInput.toLowerCase()) ||
                            a.code.toLowerCase().includes(toInput.toLowerCase())
                          ).map(a => (
                            <div
                              key={a.id}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => {
                                setTo(a.code);
                                setToInput(`${a.name} (${a.code})`);
                                setToDropdown(false);
                              }}
                            >
                              {a.name} ({a.code})
                            </div>
                          ))}
                          {airports.filter(a =>
                            a.name.toLowerCase().includes(toInput.toLowerCase()) ||
                            a.code.toLowerCase().includes(toInput.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2 text-gray-500">No airports found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Departure Date */}
                  <div className="space-y-2">
                    <Label htmlFor="departure-date" className="text-sm font-medium">
                      Departure Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        id="departure-date"
                        className="pl-10"
                        value={departureDate}
                        onChange={e => setDepartureDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Return Date */}
                  {activeTab === "round-trip" && (
                    <div className="space-y-2">
                      <Label htmlFor="return-date" className="text-sm font-medium">
                        Return Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          id="return-date"
                          className="pl-10"
                          value={returnDate}
                          onChange={e => setReturnDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {/* Passengers */}
                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-sm font-medium">
                      Passengers
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="w-full border rounded-md px-4 py-2 flex justify-between items-center bg-white">
                          <span>{adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}</span>
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="flex justify-between items-center mb-2">
                          <span>Adults</span>
                          <div className="flex items-center space-x-2">
                            <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="p-1 border rounded" disabled={adults <= 1}><Minus /></button>
                            <span>{adults}</span>
                            <button type="button" onClick={() => setAdults(Math.min(6, adults + 1))} className="p-1 border rounded" disabled={adults >= 6}><Plus /></button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Children</span>
                          <div className="flex items-center space-x-2">
                            <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="p-1 border rounded" disabled={children <= 0}><Minus /></button>
                            <span>{children}</span>
                            <button type="button" onClick={() => setChildren(Math.min(6, children + 1))} className="p-1 border rounded" disabled={children >= 6}><Plus /></button>
                          </div>
                    </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Class */}
                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-sm font-medium">
                      Business Class
                    </Label>
                    <Select value={flightClass} onValueChange={setFlightClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Business Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium">Premium Economy</SelectItem>
                        <SelectItem value="business">Business Class</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Search Button */}
                <div className="flex justify-center">
                  <Button size="lg" className="px-12" type="submit">
                    Search Flight
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;
