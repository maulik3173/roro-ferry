import Link from 'next/link';
import { Button } from "@/components/ui/button"; // Import shadcn/ui button

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-white shadow-lg px-6 py-2">
      {/* Logo Section */}
      <div className="px-6 py-2">
        <Link href="/">
          <img src="/images/logo.png" alt="ship Logo" className="h-10" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-14 text-black font-medium">
        <Link href="/" className="hover:text-blue-500 transition duration-300">Home</Link>
        <Link href="/about" className="hover:text-blue-500 transition duration-300">About</Link>
        <Link href="/contact" className="hover:text-blue-500 transition duration-300">Contact</Link>
        <Link href="/agent" className="hover:text-blue-500 transition duration-300">Agent</Link>
        <Link href="/service" className="hover:text-blue-500 transition duration-300">Service</Link>
      </nav>

      {/* Login Button */}
      <Button className="bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 p-4 mr-5 text-lg">
        Login
      </Button>
    </div>
  );
};

export default Header;