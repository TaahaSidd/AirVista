import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockBookings = [
    {
        id: 1,
        flightNumber: "AI123",
        airline: "Emirates",
        from: "Delhi (DEL)",
        to: "Dubai (DXB)",
        date: "2025-06-15",
        status: "Confirmed",
        passengers: [
            { name: "John Doe", type: "Adult" },
            { name: "Jane Doe", type: "Child" },
        ],
    },
    // Add more mock bookings as needed
];

const Profile = () => {
    const navigate = useNavigate();
    const hasBookings = mockBookings.length > 0;
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-primary">My Bookings</h1>
                {hasBookings ? (
                    <div className="space-y-8">
                        {mockBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-lg font-semibold text-gray-900">{booking.airline}</span>
                                        <span className="text-gray-600">Flight {booking.flightNumber}</span>
                                    </div>
                                    <div className="text-gray-700 mb-1">{booking.from} → {booking.to}</div>
                                    <div className="text-gray-500 text-sm mb-2">Date: {booking.date}</div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {booking.passengers.map((p, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {p.name} ({p.type})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-green-600 font-semibold">{booking.status}</span>
                                    <Button variant="outline" onClick={() => navigate('/#booking-form')}>Book Another Flight</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">No Bookings Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't booked any flights yet. Start your journey now!</p>
                        <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate('/#booking-form')}>Book a Flight</Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Profile; 