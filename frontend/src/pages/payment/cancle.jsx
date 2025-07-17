import React from "react";

const Cancle = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>
        <p className="mt-4 text-gray-600">Your payment has been cancelled.</p>
        <a href="/" className="mt-6 text-blue-500 hover:underline">
            Go back to Home
        </a>
        </div>
    );
}

export default Cancle;