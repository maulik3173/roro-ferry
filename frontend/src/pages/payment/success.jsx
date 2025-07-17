import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react"; // Using lucide icon library
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
                <h1 className="text-2xl font-semibold text-green-600">Payment Successful</h1>
                <p className="text-gray-600 mt-2">Your payment has been processed successfully.</p>
                <p className="text-sm text-gray-400 mt-1">You will be redirected to the home page shortly...</p>
            </div>
        </div>
    );
};

export default Success;
