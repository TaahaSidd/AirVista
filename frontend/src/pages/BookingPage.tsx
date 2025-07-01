import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Plane, Clock, ArrowRight, Info } from 'lucide-react';

interface Seat {
    id: number;
    seatNumber: string;
    status: 'AVAILABLE' | 'BOOKED';
}

interface Flight {
    id: number;
    flightNumber: string;
    departure: string;
    arrival: string;
    price: number;
    airline: string;
    // Add other relevant fields
}

// Airline logo mapping (add more as needed)
const airlineLogos: Record<string, string> = {
    'Emirates': '/assets/emirates-airlines-logo.png',
    'Qatar Airways': '/assets/qatar-ariways-logo.png',
    'Lufthansa': '/assets/lufthansa-airways-logo.jpg',
    'British Airways': '/assets/british-airways-logo.jpg',
    // Add more airline logo mappings here
};

const BookingPage: React.FC = () => {
    const { flightId } = useParams<{ flightId: string }>();
    const location = useLocation();
    const adults = location.state?.adults ?? 1;
    const children = location.state?.children ?? 0;
    const passengerCount = adults + children;
    const [passengers, setPassengers] = useState(Array.from({ length: passengerCount }, () => ({ name: '', email: '', phone: '' })));
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [flight, setFlight] = useState<Flight | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let flightData = location.state?.flight;
        if (!flightData) {
            // fallback mock data with all required fields
            flightData = {
                id: Number(flightId),
                flightNumber: "AI123",
                airline: "Emirates",
                price: 15543,
                duration: "3h 30m",
                departure: {
                    time: "14:30",
                    airport: "BOM",
                    city: "Mumbai",
                },
                arrival: {
                    time: "18:00",
                    airport: "DEL",
                    city: "Delhi",
                },
            };
        }
        setFlight(flightData);
        setSeats([
            { id: 1, seatNumber: "1A", status: "AVAILABLE" as const },
            { id: 2, seatNumber: "1B", status: "BOOKED" as const },
            { id: 3, seatNumber: "1C", status: "AVAILABLE" as const },
            { id: 4, seatNumber: "2A", status: "AVAILABLE" as const },
            { id: 5, seatNumber: "2B", status: "BOOKED" as const },
            { id: 6, seatNumber: "2C", status: "AVAILABLE" as const },
        ]);
        setLoading(false);
    }, [flightId, location.state]);

    useEffect(() => {
        setPassengers(Array.from({ length: passengerCount }, () => ({ name: '', email: '', phone: '' })));
    }, [passengerCount]);

    if (loading) return <div>Loading...</div>;
    if (!flight || !flight.flightNumber || !flight.airline || !flight.price) {
        return <div className="text-center text-red-600 font-semibold text-lg py-12">Flight details not found. Please select a flight from the search results.</div>;
    }

    // Defensive local variables for departure/arrival (moved after flight null check)
    let departureCity = 'N/A', departureTime = '', arrivalCity = 'N/A', arrivalTime = '';
    if (typeof flight.departure === 'object' && flight.departure !== null) {
        departureCity = (flight.departure as any).city || (flight.departure as any).airport || 'N/A';
        departureTime = (flight.departure as any).time || '';
    } else if (typeof flight.departure === 'string') {
        departureCity = flight.departure;
    }
    if (typeof flight.arrival === 'object' && flight.arrival !== null) {
        arrivalCity = (flight.arrival as any).city || (flight.arrival as any).airport || 'N/A';
        arrivalTime = (flight.arrival as any).time || '';
    } else if (typeof flight.arrival === 'string') {
        arrivalCity = flight.arrival;
    }

    // Calculate prices
    const baseFare = flight.price * passengerCount;
    const taxes = 86 * passengerCount;
    const total = baseFare + taxes;

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Book Your Flight</h1>
            <div className="flex flex-col md:flex-row md:space-x-8">
                {/* Left: Flight Details and Seat/Passenger Forms */}
                <div className="flex-1 space-y-8">
                    {/* Flight Details Card */}
                    <div className="p-6 border rounded-xl shadow bg-white">
                        <div className="flex items-center space-x-3 mb-4">
                            {/* Airline Logo and Name */}
                            {airlineLogos[flight.airline] && (
                                <img src={airlineLogos[flight.airline]} alt="Airline Logo" className="w-10 h-10 object-contain rounded mr-2" />
                            )}
                            <span className="text-xl font-semibold text-gray-900">Flight {flight.flightNumber || 'N/A'}</span>
                            <span className="ml-3 text-base text-gray-700 font-medium">{flight.airline || 'N/A'}</span>
                        </div>
                        {/* Route line with plane icon */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{departureCity}</div>
                                <div className="text-xs text-gray-500">Departure</div>
                                <div className="text-xs text-gray-500">{departureTime}</div>
                            </div>
                            <div className="flex-1 flex items-center mx-4 relative">
                                <div className="h-px bg-gray-300 w-full"></div>
                                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    <Plane className="w-6 h-6 text-primary bg-white" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{arrivalCity}</div>
                                <div className="text-xs text-gray-500">Arrival</div>
                                <div className="text-xs text-gray-500">{arrivalTime}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 mt-4">
                            <Clock className="w-5 h-5" />
                            <span>{(flight as any).duration || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Seat Selection */}
                    <div className="mb-6 p-6 border rounded-xl shadow bg-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center"><Plane className="w-5 h-5 mr-2 text-primary" />Select Your Seat</h2>
                        {/* Legend */}
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center"><div className="w-5 h-5 bg-green-200 border rounded mr-1" /> <span className="text-sm">Available</span></div>
                            <div className="flex items-center"><div className="w-5 h-5 bg-gray-300 border rounded mr-1" /> <span className="text-sm">Booked</span></div>
                            <div className="flex items-center"><div className="w-5 h-5 bg-blue-300 border-2 border-blue-600 rounded mr-1" /> <span className="text-sm">Selected</span></div>
                        </div>
                        {selectedSeat && (
                            <div className="mb-2 text-blue-700 font-medium">Selected Seat: {seats.find(s => s.id === selectedSeat)?.seatNumber}</div>
                        )}
                        <div className="grid grid-cols-6 gap-3 mb-2">
                            {seats.map(seat => (
                                <div
                                    key={seat.id}
                                    className={`p-2 border rounded text-center font-semibold transition-all
                                    ${seat.status === 'BOOKED' ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : ''}
                                    ${seat.status === 'AVAILABLE' ? 'bg-green-200 text-green-900 hover:bg-green-300 cursor-pointer' : ''}
                                    ${selectedSeat === seat.id ? 'bg-blue-300 border-2 border-blue-600 text-blue-900' : ''}
                                  `}
                                    onClick={() => seat.status === 'AVAILABLE' && setSelectedSeat(seat.id)}
                                >
                                    {seat.seatNumber}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Seats are allotted randomly by default. To select your seat, click on an available seat.</div>
                    </div>

                    {/* Passenger Details */}
                    <div className="mb-6 p-6 border rounded-xl shadow bg-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center"><Info className="w-5 h-5 mr-2 text-primary" />Passenger Details</h2>
                        {passengers.map((passenger, idx) => (
                            <form key={idx} className="mb-6">
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Name</label>
                                    <input type="text" className="border p-2 w-full rounded focus:outline-primary" placeholder={`Enter name for passenger ${idx + 1}`} value={passenger.name} onChange={e => {
                                        const updated = [...passengers];
                                        updated[idx].name = e.target.value;
                                        setPassengers(updated);
                                    }} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Email</label>
                                    <input type="email" className="border p-2 w-full rounded focus:outline-primary" placeholder="Enter email" value={passenger.email} onChange={e => {
                                        const updated = [...passengers];
                                        updated[idx].email = e.target.value;
                                        setPassengers(updated);
                                    }} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Phone</label>
                                    <input type="tel" className="border p-2 w-full rounded focus:outline-primary" placeholder="Enter phone" value={passenger.phone} onChange={e => {
                                        const updated = [...passengers];
                                        updated[idx].phone = e.target.value;
                                        setPassengers(updated);
                                    }} />
                                </div>
                            </form>
                        ))}
                        <button type="button" className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow w-full">Book Now</button>
                    </div>

                    {/* Cancellation/Refund Policy */}
                    <div className="p-6 border rounded-xl shadow bg-white">
                        <h2 className="text-lg font-semibold mb-2 flex items-center"><Info className="w-5 h-5 mr-2 text-primary" />Cancellation & Refund Policy</h2>
                        <ul className="list-disc pl-6 text-gray-700 text-sm">
                            <li>Free cancellation within 24 hours of booking.</li>
                            <li>After 24 hours, a cancellation fee of $50 applies.</li>
                            <li>No refund for cancellations within 2 hours of departure.</li>
                        </ul>
                    </div>
                </div>
                {/* Right: Price and Offers Card */}
                <div className="w-full md:w-[340px] flex-shrink-0 mt-8 md:mt-0">
                    <div className="sticky top-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-6 text-right mb-4 w-full shadow space-y-4">
                            <div className="text-lg text-gray-500 font-medium text-left">Total price</div>
                            <div className="text-3xl font-bold text-primary text-left">₹{total}</div>
                            <div className="text-sm text-gray-700 text-left">{passengerCount} {passengerCount === 1 ? 'traveller' : 'travellers'}</div>
                            <div className="border-t border-blue-100 my-2"></div>
                            <div className="flex justify-between text-sm text-gray-700">
                                <span>Base fare ({passengerCount} {passengerCount === 1 ? 'traveller' : 'travellers'})</span>
                                <span>₹{baseFare}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-700">
                                <span>Taxes and fees</span>
                                <span>₹{taxes}</span>
                            </div>
                            <div className="border-t border-blue-100 my-2"></div>
                            <div className="bg-blue-100 rounded-lg px-3 py-2 text-blue-800 text-sm font-medium flex flex-col items-start">
                                <span>Pay in 3 interest free EMIs</span>
                                <span className="text-base font-bold">at ₹{Math.round(total / 3)}/mo</span>
                                <span className="text-xs text-blue-700">View plans with your credit card</span>
                            </div>
                            <div className="border-t border-blue-100 my-2"></div>
                            <div className="text-left">
                                <div className="font-medium mb-1">Apply coupon or gift card</div>
                                <div className="flex items-center space-x-2">
                                    <input type="text" placeholder="Coupon/Gift card" className="border p-2 rounded w-full" />
                                    <button className="px-3 py-2 bg-primary text-white rounded font-semibold">Apply</button>
                                </div>
                            </div>
                            <div className="border-t border-blue-100 my-2"></div>
                            <div className="text-left">
                                <div className="font-medium mb-2">All offers</div>
                                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800 font-medium flex items-center mb-2">
                                    <span className="mr-2">🏷️</span> <span className="font-bold mr-2">CTINT</span> Flat ₹849 off <button className="ml-auto px-2 py-1 bg-green-600 text-white rounded text-xs">Apply</button>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800 font-medium flex items-center">
                                    <span className="mr-2">��</span> Additional 5% cashback with Flipkart Axis Credit Card <span className="ml-auto underline text-xs cursor-pointer">Know more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
