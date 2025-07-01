import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl font-bold text-gray-900">AirVista</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/info#about"
              className={({ isActive }) =>
                `mx-2 transition-colors font-medium ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-primary'}`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/info#tours"
              className={({ isActive }) =>
                `mx-2 transition-colors font-medium ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-primary'}`
              }
            >
              Tours
            </NavLink>
            <NavLink
              to="/info#packages"
              className={({ isActive }) =>
                `mx-2 transition-colors font-medium ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-primary'}`
              }
            >
              Packages
            </NavLink>
            <NavLink
              to="/info#contact"
              className={({ isActive }) =>
                `mx-2 transition-colors font-medium ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-primary'}`
              }
            >
              Contact Us
            </NavLink>
          </nav>

          {/* CTA Buttons or Profile */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <Avatar className="cursor-pointer">
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => navigate('/dashboard')}>Dashboard</button>
                  <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
                    <DialogTrigger asChild>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setLogoutOpen(true)}>Logout</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to log out?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancel</Button>
                        <Button className="bg-primary" onClick={() => { setLogoutOpen(false); logout(); navigate('/'); }}>Logout</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
