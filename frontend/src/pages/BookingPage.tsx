import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Plane, Clock, ArrowRight, Info } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

const BookingPage: React.FC = () => {
    const { flightId } = useParams<{ flightId: string }>();
    const location = useLocation();

    // Initialize local state from location.state on first render only
    const [init] = useState(() => {
        if (!location.state || !location.state.flight) {
            return null;
        }
        return {
            flight: location.state.flight,
            adults: location.state.adults ?? 1,
            children: location.state.children ?? 0,
        };
    });

    if (!init) {
        return <div className="text-center text-red-600 font-semibold text-lg py-12">Invalid access. Please select a flight from the search results.</div>;
    }

    const { flight, adults, children } = init;
    const passengerCount = adults + children;
    const [passengers, setPassengers] = useState(Array.from({ length: passengerCount }, () => ({ name: '', email: '', phone: '' })));
    const [selectedSeats, setSelectedSeats] = useState<(number | null)[]>(Array(passengerCount).fill(null));
    const [seats, setSeats] = useState<Seat[]>([]);
    const [seatLoading, setSeatLoading] = useState(false);
    const [seatError, setSeatError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // New state for seat selection modal
    const [seatModalOpen, setSeatModalOpen] = useState(false);
    const [activePassengerIdx, setActivePassengerIdx] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        // Robust normalization: always populate all fields with fallbacks
        let flightData = {
            ...flight,
            deptTime: flight.deptTime || flight.departure?.time || '',
            arrTime: flight.arrTime || flight.arrival?.time || '',
            originCode: flight.originCode || flight.departure?.airport || '',
            destinationCode: flight.destinationCode || flight.arrival?.airport || '',
            origin: flight.origin || flight.departure?.city || '',
            destination: flight.destination || flight.arrival?.city || '',
            duration: flight.duration || '',
        };
        // Optionally, set normalized flightData to state if you want to use it elsewhere
        // setFlight(flightData);
        // Defensive local variables for display
        setNormalizedFlight(flightData);
        setLoading(false);
    }, [flight]);

    // Local state for normalized flight info
    const [normalizedFlight, setNormalizedFlight] = useState<any>(null);

    // Fetch seat map from backend
    useEffect(() => {
        if (!flightId) return;
        setSeatLoading(true);
        setSeatError(null);
        axios.get<Seat[]>(`/AirVista/seats/flight/${flightId}`)
            .then(res => setSeats(Array.isArray(res.data) ? res.data : []))
            .catch(err => setSeatError('Failed to load seat map'))
            .then(() => setSeatLoading(false));
    }, [flightId]);

    useEffect(() => {
        setPassengers(Array.from({ length: passengerCount }, () => ({ name: '', email: '', phone: '' })));
        setSelectedSeats(Array(passengerCount).fill(null));
    }, [passengerCount]);

    if (loading) return <div>Loading...</div>;
    if (!flight || !flight.flightNumber || !flight.airline || !flight.price) {
        return <div className="text-center text-red-600 font-semibold text-lg py-12">Flight details not found. Please select a flight from the search results.</div>;
    }

    // Defensive local variables for departure/arrival (moved after flight null check)
    const departureCity = normalizedFlight?.origin || '';
    const departureCode = normalizedFlight?.originCode || '';
    const departureTime = formatTime(normalizedFlight?.deptTime);
    const arrivalCity = normalizedFlight?.destination || '';
    const arrivalCode = normalizedFlight?.destinationCode || '';
    const arrivalTime = formatTime(normalizedFlight?.arrTime);
    const departureDate = formatDate(normalizedFlight?.deptTime);
    const arrivalDate = formatDate(normalizedFlight?.arrTime);

    // Calculate prices
    const baseFare = normalizedFlight?.price * passengerCount;
    const taxes = 86 * passengerCount;
    const total = baseFare + taxes;

    // Helper to format city/code display
    const formatLocation = (city: string, code: string) => {
        if (!city && !code) return '-';
        if (!city) return code;
        if (!code) return city;
        if (city.trim().toLowerCase() === code.trim().toLowerCase()) return code;
        return `${city} (${code})`;
    };

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Book Your Flight</h1>
            <div className="flex flex-col md:flex-row md:space-x-8">
                {/* Left: Flight Details and Seat/Passenger Forms */}
                <div className="flex-1 space-y-8">
                    {/* Flight Details Card */}
                    <div className="p-10 rounded-2xl bg-gradient-to-br from-[#1D1F2F]/80 via-[#2A1B3D]/80 to-[#1D1F2F]/80 border border-purple-500/30 shadow-2xl backdrop-blur-md mb-4 transition-all duration-300">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-md">
                                <img
                                    src={airlineLogos[flight.airline] || '/assets/placeholder.svg'}
                                    alt="Airline Logo"
                                    className="w-14 h-14 object-contain"
                                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/placeholder.svg'; }}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-white text-xl">{flight.airline || '-'}</span>
                                <span className="text-purple-200 text-base">Flight {flight.flightNumber || '-'}</span>
                            </div>
                        </div>
                        {/* Route line with plane icon */}
                        <div className="flex items-center justify-between gap-8 mb-6">
                            <div className="text-center min-w-[90px]">
                                <div className="text-2xl font-extrabold text-white mb-1">{departureTime || '-'}</div>
                                <div className="text-lg font-bold text-purple-200">{formatLocation(departureCity, departureCode)}</div>
                                <div className="text-xs text-purple-300 mt-1">{departureDate}</div>
                            </div>
                            <div className="relative flex items-center w-44 h-8 mx-2">
                                <div className="w-full border-t-2 border-dashed border-purple-500" style={{ height: '0' }} />
                                <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-purple-400 bg-transparent" style={{ background: 'transparent', boxShadow: 'none' }} />
                            </div>
                            <div className="text-center min-w-[90px]">
                                <div className="text-2xl font-extrabold text-white mb-1">{arrivalTime || '-'}</div>
                                <div className="text-lg font-bold text-purple-200">{formatLocation(arrivalCity, arrivalCode)}</div>
                                <div className="text-xs text-purple-300 mt-1">{arrivalDate}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-purple-200 mt-2 text-base">
                            <Clock className="w-5 h-5" />
                            <span>{normalizedFlight?.duration || '-'}</span>
                        </div>
                    </div>

                    {/* Passenger Seat Selection */}
                    <div className="mb-6 p-8 rounded-2xl bg-gradient-to-br from-[#1D1F2F]/80 via-[#2A1B3D]/80 to-[#1D1F2F]/80 border border-purple-500/30 shadow-xl backdrop-blur-md transition-all duration-300">
                        <h2 className="text-lg font-semibold mb-6 flex items-center text-white"><Plane className="w-5 h-5 mr-2 text-purple-400" />Seat Selection</h2>
                        {passengers.map((_, idx) => (
                            <div key={idx} className="flex items-center gap-4 mb-4">
                                <span className="text-purple-200 font-medium">Passenger {idx + 1}</span>
                                <span className="text-purple-400">{selectedSeats[idx] !== null ? seats.find(s => s.id === selectedSeats[idx])?.seatNumber || '-' : 'No seat selected'}</span>
                                <button
                                    type="button"
                                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                    onClick={() => { setActivePassengerIdx(idx); setSeatModalOpen(true); }}
                                >
                                    Select seat
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Seat Selection Modal */}
                    <Dialog open={seatModalOpen} onOpenChange={setSeatModalOpen}>
                        <DialogContent className="max-w-2xl w-full glassmorphic-bar border border-purple-500/30 bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-0">
                            <DialogHeader>
                                <DialogTitle>Select a seat for Passenger {activePassengerIdx !== null ? activePassengerIdx + 1 : ''}</DialogTitle>
                            </DialogHeader>
                            <div className="p-6">
                                {seatLoading ? (
                                    <div className="text-purple-300">Loading seat map...</div>
                                ) : seatError ? (
                                    <div className="text-red-400">{seatError}</div>
                                ) : (
                                    Array.isArray(seats) && seats.length > 0 ? (
                                        <div className="grid grid-cols-6 gap-4 mb-4">
                                            {seats.map(seat => {
                                                const isBooked = seat.status === 'BOOKED';
                                                const isSelected = selectedSeats.includes(seat.id);
                                                const isCurrent = selectedSeats[activePassengerIdx ?? 0] === seat.id;
                                                return (
                                                    <div
                                                        key={seat.id}
                                                        className={`p-2 rounded-xl text-center font-semibold transition-all duration-200
                                                            ${isBooked ? 'bg-gray-300/60 text-gray-400 border border-gray-400 cursor-not-allowed' : ''}
                                                            ${!isBooked && isCurrent ? 'bg-blue-300/80 border-2 border-blue-600 text-blue-900 scale-105 shadow-lg' : ''}
                                                            ${!isBooked && !isCurrent ? 'bg-white/10 text-green-200 border border-green-400 hover:scale-105 hover:border-purple-400 hover:shadow-lg cursor-pointer' : ''}
                                                            ${isSelected && !isCurrent ? 'opacity-40 pointer-events-none' : ''}
                                                        `}
                                                        onClick={() => {
                                                            if (!isBooked && activePassengerIdx !== null && (!isSelected || isCurrent)) {
                                                                const updated = [...selectedSeats];
                                                                updated[activePassengerIdx] = seat.id;
                                                                setSelectedSeats(updated);
                                                                setSeatModalOpen(false);
                                                            }
                                                        }}
                                                    >
                                                        {seat.seatNumber}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-purple-300">No seats available.</div>
                                    )
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Passenger Details */}
                    <div className="mb-6 p-8 rounded-2xl bg-gradient-to-br from-[#1D1F2F]/80 via-[#2A1B3D]/80 to-[#1D1F2F]/80 border border-purple-500/30 shadow-xl backdrop-blur-md transition-all duration-300">
                        <h2 className="text-lg font-semibold mb-6 flex items-center text-white"><Info className="w-5 h-5 mr-2 text-purple-400" />Passenger Details</h2>
                        {passengers.map((passenger, idx) => (
                            <form key={idx} className="mb-8">
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-purple-200">Name</label>
                                    <input type="text" className="bg-white/10 border border-purple-500/20 rounded-xl p-3 w-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" placeholder={`Enter name for passenger ${idx + 1}`} value={passenger.name} onChange={e => {
                                        const updated = [...passengers];
                                        updated[idx].name = e.target.value;
                                        setPassengers(updated);
                                    }} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-purple-200">Email</label>
                                    <input type="email" className="bg-white/10 border border-purple-500/20 rounded-xl p-3 w-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" placeholder="Enter email" value={passenger.email} onChange={e => {
                                        const updated = [...passengers];
                                        updated[idx].email = e.target.value;
                                        setPassengers(updated);
                                    }} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-purple-200">Phone</label>
                                    <input type="tel" className="bg-white/10 border border-purple-500/20 rounded-xl p-3 w-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" placeholder="Enter phone" value={passenger.phone} onChange={e => {
                                        const updated = [...passengers];
                                        updated[idx].phone = e.target.value;
                                        setPassengers(updated);
                                    }} />
                                </div>
                            </form>
                        ))}
                        <button
                            type="button"
                            className="mt-4 w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Cancellation/Refund Policy */}
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1D1F2F]/80 via-[#2A1B3D]/80 to-[#1D1F2F]/80 border border-purple-500/30 shadow-xl backdrop-blur-md transition-all duration-300">
                        <h2 className="text-lg font-semibold mb-4 flex items-center text-white"><Info className="w-5 h-5 mr-2 text-purple-400" />Cancellation & Refund Policy</h2>
                        <ul className="list-disc pl-6 text-purple-200 text-sm space-y-2">
                            <li>Free cancellation within 24 hours of booking.</li>
                            <li>After 24 hours, a cancellation fee of $50 applies.</li>
                            <li>No refund for cancellations within 2 hours of departure.</li>
                        </ul>
                    </div>
                </div>
                {/* Right: Price and Offers Card */}
                <div className="w-full md:w-[340px] flex-shrink-0 mt-8 md:mt-0">
                    <div className="sticky top-8">
                        <div className="rounded-2xl bg-gradient-to-br from-[#1D1F2F]/80 via-[#2A1B3D]/80 to-[#1D1F2F]/80 border border-purple-500/30 shadow-xl backdrop-blur-md px-8 py-8 mb-4 w-full space-y-6 transition-all duration-300">
                            <div className="text-lg text-purple-200 font-medium text-left">Total price</div>
                            <div className="text-3xl font-bold text-purple-400 text-left">₹{total}</div>
                            <div className="text-sm text-purple-200 text-left">{passengerCount} {passengerCount === 1 ? 'traveller' : 'travellers'}</div>
                            <div className="border-t border-purple-500/20 my-2"></div>
                            <div className="flex justify-between text-sm text-purple-200">
                                <span>Base fare ({passengerCount} {passengerCount === 1 ? 'traveller' : 'travellers'})</span>
                                <span>₹{baseFare}</span>
                            </div>
                            <div className="flex justify-between text-sm text-purple-200">
                                <span>Taxes and fees</span>
                                <span>₹{taxes}</span>
                            </div>
                            <div className="border-t border-purple-500/20 my-2"></div>
                            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg px-4 py-3 text-purple-200 text-sm font-medium flex flex-col items-start">
                                <span>Pay in 3 interest free EMIs</span>
                                <span className="text-base font-bold text-purple-300">at ₹{Math.round(total / 3)}/mo</span>
                                <span className="text-xs text-purple-400">View plans with your credit card</span>
                            </div>
                            <div className="border-t border-purple-500/20 my-2"></div>
                            <div className="text-left">
                                <div className="font-medium mb-1 text-purple-200">Apply coupon or gift card</div>
                                <div className="flex items-center gap-2">
                                    <input type="text" placeholder="Coupon/Gift card" className="bg-white/10 border border-purple-500/20 rounded-xl p-3 w-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" />
                                    <button className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-900 transition-all">Apply</button>
                                </div>
                            </div>
                            <div className="border-t border-purple-500/20 my-2"></div>
                            <div className="text-left">
                                <div className="font-medium mb-2 text-purple-200">All offers</div>
                                <div className="bg-green-400/10 border border-green-400/30 rounded-lg px-4 py-2 text-sm text-green-200 font-medium flex items-center mb-2">
                                    <span className="mr-2">🏷️</span> <span className="font-bold mr-2">CTINT</span> Flat ₹849 off <button className="ml-auto px-2 py-1 bg-green-600 text-white rounded text-xs">Apply</button>
                                </div>
                                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2 text-sm text-yellow-200 font-medium flex items-center">
                                    <span className="mr-2">🏷️</span> Additional 5% cashback with Flipkart Axis Credit Card <span className="ml-auto underline text-xs cursor-pointer">Know more</span>
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
