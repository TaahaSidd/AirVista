import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Info = () => (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12 space-y-20">
            {/* About Us Section */}
            <section id="about" className="flex flex-col md:flex-row items-center gap-8">
                <img src="/assets/why-choose-us-img.jpg" alt="About AirVista" className="w-full md:w-1/2 rounded-xl shadow-lg object-cover h-64" />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-primary">About Us</h2>
                    <p className="text-gray-700 text-lg mb-2">We are AirVista, dedicated to making your travel seamless and memorable. Our mission is to provide the best flight booking experience, curated tours, and unbeatable packages for every traveler.</p>
                    <p className="text-gray-600">With a passion for travel and a commitment to customer satisfaction, we help you explore the world with ease and comfort.</p>
                </div>
            </section>

            {/* Tours Section */}
            <section id="tours" className="flex flex-col md:flex-row-reverse items-center gap-8">
                <img src="/assets/trip-location-img1.jpg" alt="Tours" className="w-full md:w-1/2 rounded-xl shadow-lg object-cover h-64" />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-primary">Tours</h2>
                    <p className="text-gray-700 text-lg mb-2">Explore our curated tours: from city escapes to adventure getaways, we offer experiences for every kind of traveler.</p>
                    <ul className="list-disc pl-5 text-gray-600">
                        <li>City Highlights & Sightseeing</li>
                        <li>Adventure & Nature Tours</li>
                        <li>Cultural & Heritage Experiences</li>
                        <li>Custom Group Tours</li>
                    </ul>
                </div>
            </section>

            {/* Packages Section */}
            <section id="packages" className="flex flex-col md:flex-row items-center gap-8">
                <img src="/assets/trip-location-img2.jpg" alt="Packages" className="w-full md:w-1/2 rounded-xl shadow-lg object-cover h-64" />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-primary">Packages</h2>
                    <p className="text-gray-700 text-lg mb-2">Find the best travel packages for your next adventure. We offer:</p>
                    <ul className="list-disc pl-5 text-gray-600">
                        <li>Flight + Hotel Bundles</li>
                        <li>Family & Honeymoon Packages</li>
                        <li>Seasonal & Festival Specials</li>
                        <li>Last-Minute Deals</li>
                    </ul>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="flex flex-col md:flex-row-reverse items-center gap-8">
                <img src="/assets/why-choose-us-img.jpg" alt="Contact AirVista" className="w-full md:w-1/2 rounded-xl shadow-lg object-cover h-64" />
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-primary">Contact</h2>
                    <p className="text-gray-700 text-lg mb-2">Get in touch with us for any queries, support, or partnership opportunities.</p>
                    <div className="space-y-2 text-gray-600">
                        <div><span className="font-semibold">Email:</span> airvistainfo@gmail.com</div>
                        <div><span className="font-semibold">Phone:</span> +91 98765 43210</div>
                        <div><span className="font-semibold">Address:</span> 123, AirVista Lane, New Delhi, India</div>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
    </div>
);

export default Info; 