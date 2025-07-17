import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import RootLayout from "../../layout/RootLayout";
import { FaInstagram, FaYoutube, FaFacebookF, FaTwitter } from "react-icons/fa";
import Mastercard from "../../assets/mastercard.png";
import logo from "../../assets/logo.png";
import CreditCard from "../../assets/creditcard.png"; // Fix variable name capitalization

const Footer = () => {
  return (
    <div className="w-full h-auto bg-neutral-900 py-12">
      <RootLayout>
        <div className="space-y-10">
          {/* Footer Content */}
          <div className="w-full grid grid-cols-5 gap-8">
            <div className="col-span-2 space-y-8 md:pr-10 pr-0">
              <div className="space-y-3">
                {/* logo */}
                <Link to="/" className="text-6xl text-primary font-bold">
                  RORO
                </Link>
                {/* Description */}
                <p className="text-sm text-neutral-300 font-normal">
                  It is Indias first and largest solar-powered Ro-Pax ferry,
                  giving greater convenience to passengers as well as cargo
                  transit between Surat to Saurashtra and vice versa
                </p>
              </div>
              {/* Social Media Links */}
              <div className="w-full flex items-center gap-x-5">
                <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-300">
                  <FaInstagram className="w-5 h-5 text-neutral-50" />
                </div>
                <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-300">
                  <FaYoutube className="w-5 h-5 text-neutral-50" />
                </div>
                <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-300">
                  <FaFacebookF className="w-5 h-5 text-neutral-50" />
                </div>
                <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-300">
                  <FaTwitter className="w-5 h-5 text-neutral-50" />
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-5">
              <h1 className="text-lg text-neutral-300 font-semibold">
                Quick Links
              </h1>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-neutral-400 hover:text-primary font-normal"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-neutral-400 hover:text-primary font-normal"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-neutral-400 hover:text-primary font-normal"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="col-span-1 space-y-5">
              {" "}
              <h1 className="text-lg text-neutral-300 font-semibold">
                Top Reserved Route
              </h1>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-neutral-400 hover:text-primary font-normal"
                >
                  Hazira - Ghogha
                </Link>
                <Link
                  to="/agent"
                  className="block text-neutral-400 hover:text-primary font-normal"
                >
                  Mumbai - Mandwa
                </Link>
                <Link
                  to="/contact"
                  className="block text-neutral-400 hover:text-primary font-normal"
                >
                  Mumbai - Goa
                </Link>
              </div>
            </div>
            <div className="col-span-1 space-y-5">
              <h1 className="text-lg text-neutral-300 font-semibold">
                Support Links
              </h1>
              <div className="space-y-2">
                <Link
                  to="/contact"
                  className="block text-neutral-300 hover:text-primary font-normal"
                >
                  Contact us
                </Link>
                <Link
                  to="/Faq"
                  className="block text-neutral-300 hover:text-primary font-normal"
                >
                  FAQ
                </Link>
                <Link
                  to="/term"
                  className="block text-neutral-300 hover:text-primary font-normal"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/policy"
                  className="block text-neutral-300 hover:text-primary font-normal"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className=" bg-neutral-800/50" />

          {/* Copyright */}
          <div className="w-full  items-center justify-between flex">
            <p className="text-neutral-300 font-normal text-sm">
              © {new Date().getFullYear()} roroferry. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-x-2">
              <img src={Mastercard} alt="Mastercard" className="w-8 h-8" />
              <img src={logo} alt="Logo" className="w-8 h-6" />
              <img src={CreditCard} alt="Credit Card" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </RootLayout>
    </div>
  );
};

export default Footer;
