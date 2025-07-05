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
import { MapPin, Users, ChevronDown, Plus, Minus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import type { SearchParams } from "@/pages/FlightSearchResults";

// Move airportDisplay above the component
const airportDisplay: Record<string, string> = {
  
  dubai: "Dubai (DXB)",
  london: "London (LHR)",
  newyork: "New York (JFK)",
  mumbai: "Mumbai (BOM)",
  delhi: "Delhi (DEL)",
  bangalore: "Bangalore (BLR)",
};

// Add explicit props type
interface FlightSearchFormProps {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
}

// Set default dates dynamically
const today = new Date();
const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
const defaultDeparture = formatDate(today);
const defaultReturn = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));

const FlightSearchForm = ({ searchParams, setSearchParams }: FlightSearchFormProps) => {
  const [activeTab, setActiveTab] = useState(searchParams.tripType || "one-way");
  const [from, setFrom] = useState(searchParams.from || "");
  const [to, setTo] = useState(searchParams.to || "");
  const [adults, setAdults] = useState(() => {
    const match = /([0-9]+) Adult/.exec(searchParams.passengers || '1 Adult');
    return match ? parseInt(match[1], 10) : 1;
  });
  const [children, setChildren] = useState(() => {
    const match = /([0-9]+) Child/.exec(searchParams.passengers || '');
    return match ? parseInt(match[1], 10) : 0;
  });
  const [departureDate, setDepartureDate] = useState(searchParams.departureDate || "");
  const [returnDate, setReturnDate] = useState(searchParams.returnDate || "");
  const [flightClass, setFlightClass] = useState(searchParams.class || "economy");
  const [airports, setAirports] = useState<{ id: number; name: string; code: string }[]>([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromDropdown, setFromDropdown] = useState(false);
  const [toDropdown, setToDropdown] = useState(false);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      from: fromInput || from,
      to: toInput || to,
      departureDate,
      returnDate: activeTab === 'round-trip' ? returnDate : undefined,
      passengers: `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`,
      class: flightClass,
      tripType: activeTab,
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/AirVista/Airport")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error("Failed to fetch airports", err));
  }, []);

  return (
    <div className="shadow-2xl bg-black/60 backdrop-blur border border-white/20 rounded-2xl">
      <form className="w-full p-6" onSubmit={handleSearch}>
        {/* Tab Navigation */}
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-black/30 p-1 text-purple-200 mb-8 w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("round-trip")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${activeTab === "round-trip"
              ? "bg-purple-700/80 text-white shadow"
              : "hover:bg-white/5"
              }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("one-way")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${activeTab === "one-way"
              ? "bg-purple-700/80 text-white shadow"
              : "hover:bg-white/5"
              }`}
          >
            One-way
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("multi-city")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${activeTab === "multi-city"
              ? "bg-purple-700/80 text-white shadow"
              : "hover:bg-white/5"
              }`}
          >
            Multi-City
          </button>
        </div>
        <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Departure Airport */}
            <div className="space-y-2">
              <Label htmlFor="from-airport" className="text-sm font-medium text-purple-300">Departure Airport</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
                <input
                  ref={fromInputRef}
                  id="from-airport"
                  type="text"
                  className="pl-10 w-full border border-white/20 bg-black/60 text-white rounded-md h-12 placeholder:text-purple-300 backdrop-blur"
                  placeholder="From"
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
                  <div className="absolute z-10 bg-black/80 border border-white/20 w-full mt-1 rounded shadow max-h-48 overflow-y-auto backdrop-blur">
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
              <Label htmlFor="to-airport" className="text-sm font-medium text-purple-300">Arrival Airport</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
                <input
                  ref={toInputRef}
                  id="to-airport"
                  type="text"
                  className="pl-10 w-full border border-white/20 bg-black/60 text-white rounded-md h-12 placeholder:text-purple-300 backdrop-blur"
                  placeholder="To"
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
                  <div className="absolute z-10 bg-black/80 border border-white/20 w-full mt-1 rounded shadow max-h-48 overflow-y-auto backdrop-blur">
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
              <Label htmlFor="departure-date" className="text-sm font-medium text-purple-300">
                Departure Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full border border-white/20 bg-black/60 text-white rounded-md h-12 pl-10 pr-4 flex items-center justify-between placeholder:text-purple-300 backdrop-blur cursor-pointer hover:border-purple-400/50 transition-colors focus:border-purple-400 focus:outline-none"
                  >
                    <span>{departureDate ? format(parse(departureDate, "yyyy-MM-dd", new Date()), "MM/dd/yyyy") : "Select date"}</span>
                    <CalendarIcon className="w-5 h-5 text-purple-300 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate ? parse(departureDate, "yyyy-MM-dd", new Date()) : undefined}
                    onSelect={date => {
                      if (date) setDepartureDate(format(date, "yyyy-MM-dd"));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Return Date */}
            {activeTab === "round-trip" && (
              <div className="space-y-2">
                <Label htmlFor="return-date" className="text-sm font-medium text-purple-300">
                  Return Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full border border-white/20 bg-black/60 text-white rounded-md h-12 pl-10 pr-4 flex items-center justify-between placeholder:text-purple-300 backdrop-blur cursor-pointer hover:border-purple-400/50 transition-colors focus:border-purple-400 focus:outline-none"
                    >
                      <span>{returnDate ? format(parse(returnDate, "yyyy-MM-dd", new Date()), "MM/dd/yyyy") : "Select date"}</span>
                      <CalendarIcon className="w-5 h-5 text-purple-300 ml-2" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate ? parse(returnDate, "yyyy-MM-dd", new Date()) : undefined}
                      onSelect={date => {
                        if (date) setReturnDate(format(date, "yyyy-MM-dd"));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {/* Passengers */}
            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-sm font-medium text-purple-300">
                Passengers
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="w-full border border-white/20 bg-black/60 text-white rounded-md h-12 px-4 flex justify-between items-center backdrop-blur">
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
              <Label htmlFor="class" className="text-sm font-medium text-purple-300">
                Class
              </Label>
              <Select value={flightClass} onValueChange={setFlightClass}>
                <SelectTrigger className="border border-white/20 bg-black/60 text-white backdrop-blur h-12">
                  <SelectValue placeholder="Economy" />
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
    </div>
  );
};

export default FlightSearchForm;
