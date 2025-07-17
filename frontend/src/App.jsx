import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Ticket from "./pages/ticket/Ticket";
import NotFound from "./pages/notfound/NotFound";
import Contact from "./pages/contact/Contact";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Terms from "./pages/Terms/TermsOfService";
import ReviewPage from "./pages/review/ReviewPage";
import FerrySelection from "./pages/ticket/FerrySelection";
import BookingForm from "./pages/ticket/PassengerDetails";
import Faq from "./pages/faq/Faq";
import ForgotPassword from "./pages/forgetpassword/ForgetPassword";
import OtpPage from "./pages/forgetpassword/OtpPage";
import Profile from "./pages/profile/Profile";
import Success from "./pages/payment/success";
import Cancle from "./pages/payment/cancle";
import Payment from "./component/Payment";
import PaymentStatus from "./component/PaymentStatus";
import MyBookings from "./pages/ticket/MyBooking";

// Admin Pages
import AdminLogin from "./Admin/pages/LoginPage";
import Sidebar from "./Admin/components/Sidebar";
import Dashboard from "./Admin/pages/Dashboard";
import UsersPage from "./Admin/pages/UsersPage";
import ShipManagement from "./Admin/pages/Ferry/ShipManagement";
import ScheduleManagement from "./Admin/pages/Schedule/ScheduleManagement";
import FeedbackManage from "./Admin/pages/FeedbackManage";
import ContactManagement from "./Admin/pages/ContactManagement";
import AddFerryForm from "./Admin/pages/Ferry/AddForm";
import AddSchedule from "./Admin/pages/Schedule/AddSchedule";
import AllBookings from "./Admin/pages/Booking";
import "./index.css";

const App = () => {
  const userId = localStorage.getItem("userId");
  return (

    <Router>
      <Toaster/>
      <MainLayout />
    </Router>
  );
}

const MainLayout = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(!!token);  
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";

  const hideLayout = ["/login", "/register", "/forgot-password", "/otp", "/admin/login"].includes(location.pathname);

  return (
    <div className="w-full flex min-h-screen bg-neutral-50">
      
      {isAdminPage && isAuthenticated && <Sidebar />} 

      <div className="flex-1 flex flex-col">
        
        {!isAdminPage && !hideLayout && <Navbar />}
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          {isAuthenticated ? (
            <>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/ship" element={<ShipManagement />} />
              <Route path="/admin/schedule" element={<ScheduleManagement />} />
              <Route path="/admin/booking" element={<AllBookings />} />
              <Route path="/admin/feedback" element={<FeedbackManage />} />
              <Route path="/admin/contact" element={<ContactManagement />} />
              <Route path="/admin/add-ferry" element={<AddFerryForm />} />
              <Route path="/admin/add-schedule" element={<AddSchedule />} />
              
            </>
          ) : (
            <Route path="*" element={<Navigate to="/admin/login" />} />
          )}

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/ferry-selection/:id" element={<FerrySelection />} />
          <Route path="/passenger-details" element={<BookingForm />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/payment-success" element={<Success />} />
          <Route path="/payment/cancle" element={<Cancle />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymentStatus" element={<PaymentStatus />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {!isAdminPage && !hideLayout && <Footer />}
      </div>
    </div>
  );
}

export default App;