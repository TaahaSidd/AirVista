import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiPost, setToken } from "@/lib/api";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = await apiPost<{ accessToken: string; refreshToken: string }>(
                "/auth/register",
                { fname: firstName, lname: lastName, email, password }
            );
            setToken(res.accessToken);
            login();
            navigate("/");
        } catch (err: any) {
            setError(err?.message || "Sign up failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign Up for AirVista</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <Input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="First name" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <Input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Last name" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm your password" />
                    </div>
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <span className="text-primary cursor-pointer font-medium" onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;