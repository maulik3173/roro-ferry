  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import { FaBars, FaX } from "react-icons/fa6";

  const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [moreOpen, setMoreOpen] = useState(false);

    const navItems = [
      { label: "Home", link: "/" },
      { label: "About", link: "/about" },
      { label: "Ticket", link: "/ticket" },
      { label: "Agent", link: "/agent" },
      { label: "Contact", link: "/contact" },
    ];

    const moreItems = [
      { label: "Register", link: "/register" },
      { label: "Terms & Conditions", link: "/terms" },
      // { label: "Blog", link: "/blog" },
    ];

    const handleOpen = () => {
      setOpen(!open);
    };

    useEffect(() => {
      const handleScroll = () => {
        const currentScrollState = window.scrollY;
        if (currentScrollState > scrollPosition && currentScrollState > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setScrollPosition(currentScrollState);
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [scrollPosition]);

    return (
      <nav
        className={`w-full h-[8ch] fixed top-0 left-0 px-4 md:px-16 lg:px-24 backdrop-filter backdrop-blur-lg transition-transform duration-300 z-50 bg-white shadow-md ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${scrollPosition > 50 ? "bg-violet-500" : "bg-neutral-100/10"}`}
      >
        <div className="w-full h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-4xl text-blue-500 font-bold">
            RORO
          </Link>

          {/* Mobile Menu Icon */}
          <div
            className="w-fit md:hidden flex items-center cursor-pointer text-neutral-800 text-2xl"
            onClick={handleOpen}
          >
            {open ? <FaX /> : <FaBars />}
          </div>

          {/* Navigation Links */}
          <div
            className={`absolute md:relative top-[8ch] md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none md:flex items-center gap-8 px-4 md:px-0 py-4 md:py-0 transition-all duration-300 ${
              open ? "block" : "hidden md:flex"
            }`}
          >
            <ul className="list-none flex flex-col md:flex-row items-start md:items-center md:gap-8 text-lg text-neutral-500 font-normal">
              {navItems.map((item, index) => (
                <li key={index} className="w-full md:w-auto">
                  <Link
                    to={item.link}
                    className="block w-full md:inline py-2 px-4 md:px-0 hover:text-blue-500 transition duration-300"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* More Dropdown */}
              <li
                className="relative group cursor-pointer w-full md:w-auto"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <span className="block w-full md:inline py-2 px-4 md:px-0 hover:text-blue-500 transition duration-300">
                  More ▾
                </span>
                <ul
                  className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                    moreOpen ? "block" : "hidden"
                  }`}
                >
                  {moreItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            {/* Login Button */}
            <Link to="/login" className="w-full md:w-auto">
              <button className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group">
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
                <span className="absolute bottom-0 left-0 h-full -ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-auto h-full opacity-100 object-stretch"
                    viewBox="0 0 487 487"
                  >
                    <path
                      fillOpacity=".1"
                      fillRule="nonzero"
                      fill="#FFF"
                      d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                    ></path>
                  </svg>
                </span>
                <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="object-cover w-full h-full"
                    viewBox="0 0 487 487"
                  >
                    <path
                      fillOpacity="0.1"
                      fillRule="nonzero"
                      fill="#FFF"
                      d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
                <span className="relative text-base font-semibold">Login</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;
