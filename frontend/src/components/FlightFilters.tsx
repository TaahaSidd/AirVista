import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Plane } from "lucide-react";
import { useState } from "react";

interface FlightFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedAirlines: string[];
  setSelectedAirlines: (airlines: string[]) => void;
  selectedStops: string[];
  setSelectedStops: (stops: string[]) => void;
  selectedTimes: string[];
  setSelectedTimes: (times: string[]) => void;
  durationRange: [number, number];
  setDurationRange: (range: [number, number]) => void;
}

const FlightFilters = ({
  priceRange, setPriceRange,
  selectedAirlines, setSelectedAirlines,
  selectedStops, setSelectedStops,
  selectedTimes, setSelectedTimes,
  durationRange, setDurationRange
}: FlightFiltersProps) => {
  // Airline options (should be dynamic in real app)
  const airlineOptions = [
    "Emirates", "Qatar Airways", "Lufthansa", "British Airways", "Turkish Airlines"
  ];
  const stopOptions = ["Non-stop", "1 Stop", "2+ Stops"];
  const timeOptions = ["Early Morning", "Afternoon", "Evening", "Night"];

  const handleAirlineChange = (airline: string) => {
    setSelectedAirlines(
      selectedAirlines.includes(airline)
        ? selectedAirlines.filter(a => a !== airline)
        : [...selectedAirlines, airline]
    );
  };
  const handleStopChange = (stop: string) => {
    setSelectedStops(
      selectedStops.includes(stop)
        ? selectedStops.filter(s => s !== stop)
        : [...selectedStops, stop]
    );
  };
  const handleTimeChange = (time: string) => {
    setSelectedTimes(
      selectedTimes.includes(time)
        ? selectedTimes.filter(t => t !== time)
        : [...selectedTimes, time]
    );
  };
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <span className="w-5 h-5 mr-2 text-primary text-xl">₹</span>
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={70000}
            min={20000}
            step={2500}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Airlines */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Plane className="w-5 h-5 mr-2 text-primary" />
            Airlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {airlineOptions.map((airline) => (
            <div key={airline} className="flex items-center space-x-3">
              <Checkbox
                id={airline.toLowerCase().replace(/\s+/g, "-")}
                checked={selectedAirlines.includes(airline)}
                onCheckedChange={() => handleAirlineChange(airline)}
              />
              <Label
                htmlFor={airline.toLowerCase().replace(/\s+/g, "-")}
                className="flex-1 cursor-pointer"
              >
                <span className="text-sm">{airline}</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Departure Time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Departure Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {timeOptions.map((time) => (
            <div key={time} className="flex items-center space-x-3">
              <Checkbox
                id={time.toLowerCase().replace(/\s+/g, "-")}
                checked={selectedTimes.includes(time)}
                onCheckedChange={() => handleTimeChange(time)}
              />
              <Label
                htmlFor={time.toLowerCase().replace(/\s+/g, "-")}
                className="flex-1 cursor-pointer"
              >
                <span className="text-sm">{time}</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stops */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Stops</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stopOptions.map((stop) => (
            <div key={stop} className="flex items-center space-x-3">
              <Checkbox
                id={stop.toLowerCase().replace(/\s+/g, "-")}
                checked={selectedStops.includes(stop)}
                onCheckedChange={() => handleStopChange(stop)}
              />
              <Label
                htmlFor={stop.toLowerCase().replace(/\s+/g, "-")}
                className="flex-1 cursor-pointer"
              >
                <span className="text-sm">{stop}</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trip Duration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trip Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={durationRange}
            onValueChange={setDurationRange}
            max={30}
            min={2}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>4h</span>
            <span>20h</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightFilters;
