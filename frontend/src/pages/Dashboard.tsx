import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    // TODO: Replace with real booking check
    const hasBookings = false;
    if (hasBookings) {
        navigate('/profile');
        return null;
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AirVista!</h2>
                <p className="text-lg text-gray-700 mb-6">
                    You are now logged in. Explore your bookings, manage your profile, and discover new destinations.
                </p>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate('/#booking-form')}>Book a Flight</Button>
            </div>
        </div>
    );
};

export default Dashboard;