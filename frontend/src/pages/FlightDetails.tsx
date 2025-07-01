import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Flight {
    id: string;
    airline: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
    price: number;
}

const FlightDetails = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCancellation, setShowCancellation] = useState(false);

    useEffect(() => {
        // TODO: Replace with real API call
        setTimeout(() => {
            setFlight({
                id: id || "1",
                airline: "AirVista Airways",
                from: "Paris (CDG)",
                to: "Tokyo (HND)",
                departure: "2024-07-10 09:00",
                arrival: "2024-07-10 22:00",
                duration: "13h",
                price: 499,
            });
            setLoading(false);
        }, 800);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading flight details...</div>;
    }

    if (!flight) {
        return <div className="min-h-screen flex items-center justify-center">Flight not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-4">Flight Details</h2>
                    <div className="mb-6">
                        <div className="text-lg font-semibold mb-2">{flight.airline}</div>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-2">
                            <span className="text-gray-700">From: <span className="font-medium">{flight.from}</span></span>
                            <span className="text-gray-700">To: <span className="font-medium">{flight.to}</span></span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-2">
                            <span className="text-gray-700">Departure: <span className="font-medium">{flight.departure}</span></span>
                            <span className="text-gray-700">Arrival: <span className="font-medium">{flight.arrival}</span></span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-2">
                            <span className="text-gray-700">Departure Terminal: <span className="font-medium">T1</span></span>
                            <span className="text-gray-700">Arrival Terminal: <span className="font-medium">T3</span></span>
                        </div>
                        <div className="text-gray-700 mb-2">Duration: <span className="font-medium">{flight.duration}</span></div>
                        <div className="text-gray-700 mb-2">Checked Baggage: <span className="font-medium">23kg included</span></div>
                        <div className="text-gray-700 mb-2">Cabin Baggage: <span className="font-medium">7kg included</span></div>
                        <div className="text-gray-900 text-xl font-bold mb-4">₹{flight.price}</div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 mb-4">Book This Flight</Button>

                    {/* Cancellation Policy Dropdown */}
                    <div className="mb-2">
                        <button
                            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                            onClick={() => setShowCancellation((prev) => !prev)}
                        >
                            <span className="font-medium">Cancellation Policy</span>
                            <span>{showCancellation ? "▲" : "▼"}</span>
                        </button>
                        {showCancellation && (
                            <div className="bg-gray-50 border border-gray-200 rounded-b px-4 py-3 text-gray-700 text-sm">
                                <ul className="list-disc pl-5">
                                    <li>Free cancellation within 24 hours of booking.</li>
                                    <li>After 24 hours, a cancellation fee of $50 applies.</li>
                                    <li>No refund for cancellations within 2 hours of departure.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FlightDetails; 