import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiPost, setToken } from "@/lib/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await apiPost<{ accessToken: string; refreshToken: string }>(
                "/auth/authenticate",
                { email, password }
            );
            setToken(res.accessToken);
            login();
            navigate("/");
        } catch (err: any) {
            setError(err?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-stretch justify-center bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Left: Image (hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black">
                <img
                    src="/assets/Registration-img.jpg"
                    alt="Registration visual"
                    className="w-full h-full object-cover rounded-l-2xl"
                />
            </div>
            {/* Right: Glassmorphic Form */}
            <div className="flex w-full md:w-1/2 items-center justify-center p-6">
                <div className="w-full max-w-md p-1 rounded-2xl">
                    <div className="bg-black/70 border border-white/20 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl" style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 8px 0 rgba(255,255,255,0.05)'}}>
                        <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">Login</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                            </div>
                            {error && <div className="text-red-300 text-sm text-center">{error}</div>}
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Login</Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-white drop-shadow">
                            Don't have an account?{' '}
                            <span className="text-primary cursor-pointer font-medium" onClick={() => navigate('/signup')}>Sign Up</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 