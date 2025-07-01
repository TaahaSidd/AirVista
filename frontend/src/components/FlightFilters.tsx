import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Plane, DollarSign } from "lucide-react";
import { useState } from "react";

interface FlightFiltersProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (range: [number, number]) => void;
}

const FlightFilters = ({ minPrice, maxPrice, onPriceChange }: FlightFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const handleSliderChange = (range: [number, number]) => {
    setPriceRange(range);
    onPriceChange(range);
  };
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handleSliderChange}
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
          {[
            { name: "Emirates", count: 24, price: "₹48,750" },
            { name: "Qatar Airways", count: 18, price: "₹39,000" },
            { name: "Lufthansa", count: 12, price: "₹36,000" },
            { name: "British Airways", count: 15, price: "₹44,250" },
            { name: "Turkish Airlines", count: 21, price: "₹30,750" },
          ].map((airline) => (
            <div key={airline.name} className="flex items-center space-x-3">
              <Checkbox id={airline.name.toLowerCase().replace(" ", "-")} />
              <Label
                htmlFor={airline.name.toLowerCase().replace(" ", "-")}
                className="flex-1 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">{airline.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {airline.count}
                    </Badge>
                    <span className="text-xs text-primary font-medium">
                      {airline.price}
                    </span>
                  </div>
                </div>
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
          {[
            { time: "Early Morning", period: "06:00 - 12:00", count: 42 },
            { time: "Afternoon", period: "12:00 - 18:00", count: 38 },
            { time: "Evening", period: "18:00 - 24:00", count: 24 },
            { time: "Night", period: "00:00 - 06:00", count: 16 },
          ].map((timeSlot) => (
            <div key={timeSlot.time} className="flex items-center space-x-3">
              <Checkbox id={timeSlot.time.toLowerCase().replace(" ", "-")} />
              <Label
                htmlFor={timeSlot.time.toLowerCase().replace(" ", "-")}
                className="flex-1 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{timeSlot.time}</div>
                    <div className="text-xs text-gray-600">
                      {timeSlot.period}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {timeSlot.count}
                  </Badge>
                </div>
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
          {[
            { type: "Non-stop", count: 28, price: "₹65,000" },
            { type: "1 Stop", count: 45, price: "₹42,000" },
            { type: "2+ Stops", count: 23, price: "₹32,000" },
          ].map((stop) => (
            <div key={stop.type} className="flex items-center space-x-3">
              <Checkbox id={stop.type.toLowerCase().replace(" ", "-")} />
              <Label
                htmlFor={stop.type.toLowerCase().replace(" ", "-")}
                className="flex-1 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">{stop.type}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {stop.count}
                    </Badge>
                    <span className="text-xs text-primary font-medium">
                      {stop.price}
                    </span>
                  </div>
                </div>
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
            defaultValue={[4, 20]}
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
