import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, Shield, Clock, CreditCard, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1a0b2e] via-[#2a133d] to-[#1a0b2e] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top Section with Logo and Description */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AirVista
                </span>
              </div>
              <p className="text-purple-200 text-lg leading-relaxed max-w-md">
                Your trusted partner for seamless air travel experiences. We connect you to the world with
                competitive pricing, exceptional service, and unwavering commitment to your journey.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-purple-500/30">
                  <Facebook className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-purple-500/30">
                  <Instagram className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-purple-500/30">
                  <Twitter className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-purple-500/30">
                  <Linkedin className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-purple-500/30">
                  <Youtube className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Flight Search
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Book Flight
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Flight Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Manage Booking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Unaccompanied Minors
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Live Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-200 hover:text-white transition-colors flex items-center group">
                    Travel Insurance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Secure Booking</h4>
              <p className="text-purple-200 text-sm">Your data is protected with bank-level security encryption.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-purple-200 text-sm">Round-the-clock customer support for all your travel needs.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Flexible Payment</h4>
              <p className="text-purple-200 text-sm">Multiple payment options including installments and EMI.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Expert Team</h4>
              <p className="text-purple-200 text-sm">Travel experts to help you plan the perfect journey.</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Call Us</h4>
                <p className="text-purple-200">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Email Us</h4>
                <p className="text-purple-200">support@airvista.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Visit Us</h4>
                <p className="text-purple-200">123 Flight Street, NY, USA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-900/50 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
                <p className="text-purple-300 text-sm">© 2024 AirVista. All rights reserved.</p>
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-purple-300 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-purple-300 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </a>
                  <a href="#" className="text-purple-300 hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-purple-300 text-sm">Certified by:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">SSL Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
