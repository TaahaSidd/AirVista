import Header from "@/components/Header";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightResults from "@/components/FlightResults";
import FlightFilters from "@/components/FlightFilters";
import Footer from "@/components/Footer";
import { useState, useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@/components/ui/button";

// Define a type for all search parameters
export type SearchParams = {
  from: string;
  to: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: string;
  class?: string;
  tripType?: string;
};

const FlightSearchResults = () => {
  const location = useLocation();
  const initialParams: SearchParams = location.state?.searchParams || { from: 'Dubai (DXB)', to: 'Mumbai (BOM)' };
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams);

  // --- Filter State ---
  const [priceRange, setPriceRange] = useState<[number, number]>([20000, 70000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState<[number, number]>([4, 20]);
  const [showAll, setShowAll] = useState(false);

  // Ref and state to measure sidebar height
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersHeight, setFiltersHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (filtersRef.current) {
      setFiltersHeight(filtersRef.current.offsetHeight);
    }
  }, [priceRange, selectedAirlines, selectedStops, selectedTimes, durationRange]);

  // Helper to reset all filters to their broadest values
  const resetFilters = () => {
    setPriceRange([0, 1000000]); // very broad range
    setSelectedAirlines([]);
    setSelectedStops([]);
    setSelectedTimes([]);
    setDurationRange([0, 100]); // very broad range
  };

  const handleShowAllClick = () => {
    if (!showAll) {
      resetFilters();
    }
    setShowAll((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />

      {/* Search Form Section */}
      <section className="bg-white shadow-sm border-b pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative">
            <GlowingEffect
              glow={true}
              spread={100}
              proximity={200}
              inactiveZone={0.001}
              blur={12}
              borderWidth={3}
              className="z-0"
              disabled={false}
            />
            <div className="relative z-10">
              <FlightSearchForm searchParams={searchParams} setSearchParams={setSearchParams} />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8 items-start" style={{ minHeight: '0' }}>
          {/* Filters Sidebar */}
          <div className="lg:col-span-1" ref={filtersRef}>
            <FlightFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedAirlines={selectedAirlines}
              setSelectedAirlines={setSelectedAirlines}
              selectedStops={selectedStops}
              setSelectedStops={setSelectedStops}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
              durationRange={durationRange}
              setDurationRange={setDurationRange}
            />
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            <FlightResults
              searchParams={searchParams}
              priceRange={priceRange}
              selectedAirlines={selectedAirlines}
              selectedStops={selectedStops}
              selectedTimes={selectedTimes}
              durationRange={durationRange}
              showAll={showAll}
              isShowAllMode={showAll}
              maxHeightPx={filtersHeight}
              onShowAllClick={handleShowAllClick}
              showAllButtonLabel={showAll ? "Show Search Results" : "Show All Flights"}
              showAllButtonVariant={showAll ? "secondary" : "default"}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlightSearchResults;
