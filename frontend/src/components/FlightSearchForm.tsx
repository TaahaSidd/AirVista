import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, ChevronDown, Plus, Minus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const defaultDeparture = formatDate(today);
const defaultReturn = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));

const FlightSearchForm = ({ searchParams, setSearchParams }: FlightSearchFormProps) => {
  const [activeTab, setActiveTab] = useState("one-way");
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
  const [departureDate, setDepartureDate] = useState(searchParams.departureDate || defaultDeparture);
  const [returnDate, setReturnDate] = useState(searchParams.returnDate || defaultReturn);
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
      from: airportDisplay[from] || from,
      to: airportDisplay[to] || to,
      passengers: `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`,
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/AirVista/Airport")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error("Failed to fetch airports", err));
  }, []);

  return (
    <form className="bg-white rounded-lg border p-6" onSubmit={handleSearch}>
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("round-trip")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "round-trip"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Round Trip
        </button>
        <button
          onClick={() => setActiveTab("one-way")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "one-way"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          One-way
        </button>
        <button
          onClick={() => setActiveTab("multi-city")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "multi-city"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Multi-City
        </button>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* From */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={fromInputRef}
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
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-base"
                  style={{ borderBottom: '1px solid #eee' }}
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

        {/* To */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={toInputRef}
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
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-base"
                  style={{ borderBottom: '1px solid #eee' }}
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

        {/* Departure */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <Input type="date" className="pl-10 h-12" defaultValue={departureDate} />
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
            Departure
          </label>
        </div>

        {/* Return */}
        {activeTab === "round-trip" && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="date"
              className="pl-10 h-12"
              defaultValue={returnDate}
            />
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
              Return
            </label>
          </div>
        )}

        {/* Passengers */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
            Passengers
          </label>
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

        {/* Search Button */}
        <Button className="h-12 px-6" type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
