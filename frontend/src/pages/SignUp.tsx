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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [agreed, setAgreed] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // Password strength logic
    const checkStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        setPasswordStrength(score);
    };

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
                    <div className="bg-black/70 border border-white/20 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 8px 0 rgba(255,255,255,0.05)' }}>
                        <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">Sign Up</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <Input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="First name" className="bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                                </div>
                                <div className="w-1/2">
                                    <Input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Last name" className="bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                                </div>
                            </div>
                            <div>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                            </div>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }} required placeholder="Create a password" className="pr-16 bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center h-10 px-2 text-white/60 text-sm font-medium focus:outline-none"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    style={{ minWidth: 48 }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                {/* Password strength meter */}
                                <div className="mt-2 h-2 w-full bg-white/10 rounded">
                                    <div
                                        className={`h-2 rounded transition-all duration-300 ${
                                            passwordStrength === 0
                                                ? "w-0"
                                                : passwordStrength === 1
                                                ? "w-1/4 bg-red-500"
                                                : passwordStrength === 2
                                                ? "w-1/2 bg-yellow-400"
                                                : passwordStrength === 3
                                                ? "w-3/4 bg-blue-500"
                                                : passwordStrength >= 4
                                                ? "w-full bg-green-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm your password" className="pr-16 bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center h-10 px-2 text-white/60 text-sm font-medium focus:outline-none"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    tabIndex={-1}
                                    style={{ minWidth: 48 }}
                                >
                                    {showConfirm ? "Hide" : "Show"}
                                </button>
                                {confirmPassword && password !== confirmPassword && (
                                    <div className="text-red-400 text-xs mt-2">Passwords do not match</div>
                                )}
                            </div>
                            {/* Terms and privacy */}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-purple-600" required />
                                <label htmlFor="terms" className="text-white text-sm">
                                    I agree to the <a href="#" className="underline text-purple-300">Terms</a> and <a href="#" className="underline text-purple-300">Privacy Policy</a>
                                </label>
                            </div>
                            {error && <div className="text-red-300 text-sm text-center">{error}</div>}
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={!agreed}>Sign Up</Button>
                        </form>
                        {/* Social Signup at the bottom */}
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2 rounded-lg mt-6 hover:bg-gray-100 transition">
                            <img src="/assets/google.png" alt="Google" className="w-5 h-5" />
                            Sign up with Google
                        </button>
                        <p className="mt-4 text-center text-sm text-white drop-shadow">
                            Already have an account?{' '}
                            <span className="text-primary cursor-pointer font-medium" onClick={() => navigate('/login')}>Login</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;