import Header from "@/components/Header";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightResults from "@/components/FlightResults";
import FlightFilters from "@/components/FlightFilters";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLocation } from "react-router-dom";

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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Form Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FlightSearchForm searchParams={searchParams} setSearchParams={setSearchParams} />
        </div>
      </section>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FlightFilters minPrice={0} maxPrice={0} onPriceChange={function (range: [number, number]): void {
              throw new Error("Function not implemented.");
            }} />
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            <FlightResults searchParams={searchParams} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlightSearchResults;
