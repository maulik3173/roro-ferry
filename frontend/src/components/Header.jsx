"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button"; // Import shadcn/ui button
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 flex items-center justify-between px-6 py-2 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-sm shadow-lg' // Blur effect and semi-transparent background
          : 'bg-transparent'
      }`}
    >
      {/* Logo Section */}
      <div className="px-6 py-2">
        <Link href="/">
          <img src="/images/logo.png" alt="Ship Logo" className="h-10" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-14 font-medium font-sans
">
        {[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
          { href: "/agent", label: "Agent" },
          { href: "/service", label: "Service" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-blue-500 transition duration-300 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Login Button */}
      <Button
        className={`bg-transparent border-2 hover:bg-blue-500 hover:text-white transition duration-300 
 p-4 font-mono
  mr-5 text-lg ${
          isScrolled
            ? 'text-blue-500 border-blue-500'
            : 'text-white border-white'
        }`}
      >
        Login
      </Button>
    </header>
  );
};

export default Header;