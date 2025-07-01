import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BookingForm from "@/components/BookingForm";
import TravelSupport from "@/components/TravelSupport";
import PopularDestinations from "@/components/PopularDestinations";
import WhyChooseUs from "@/components/WhyChooseUs";
import UnaccompaniedMinors from "@/components/UnaccompaniedMinors";
import Footer from "@/components/Footer";
import Login from "./Login";
import SignUp from "./SignUp";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <BookingForm />
      <TravelSupport />
      <PopularDestinations />
      <WhyChooseUs />
      <UnaccompaniedMinors />
      <Footer />
    </div>
  );
};

export default Index;
