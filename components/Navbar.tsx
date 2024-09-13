'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const links = ['Shop', 'About', 'Blogs'];

  // Identify link that is currently active
  const isActive = (path: string): string => (pathname === path ? 'active' : '');

  const toggleNav = () => {
    setNav((prev) => !prev);
  };

  const handleNavClick = (href: string) => {
    setLoading(true);
    setNav((prev) => !prev);
    router.push(href);
  };

  return (
    <nav className="flex justify-between items-center p-2 md:p-4 relative bg-white shadow-sm">
      <div>
        <Link href="/">
          <Image
            src="/skye logo.png"
            alt="logo"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </Link>
      </div>
      {/* Hamburger Menu */}
      <div className="md:hidden">
        <Image
          src="/hamburger-menu.svg"
          onClick={toggleNav}
          alt="menu"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        {links.map((link) => (
          <Link key={link} href={`/${link.toLowerCase()}`} className={`nav-link ${isActive(`/${link.toLowerCase()}`)}`}>
            {link}
          </Link>
        ))}
         <Link href='./register' className="p-[9px] bg-yellow-700 text-white" >Book Appointment </Link>
      </div>

      {/* Mobile Nav */}
      <div
        className={`${
          nav ? 'block' : 'hidden'
        } absolute top-20 left-0 w-full bg-gray-100 md:hidden z-10 p-6`}
      >
        <ul className="flex flex-col items-center space-y-6">
          <li className="nav-item">
            <Link
              href="/"
              onClick={() => {
                handleNavClick('/');
              }}
              className={`nav-link ${isActive('/')}`}
            >
              Home
            </Link>
          </li>
          {links.map((link) => (
            <li key={link} className="nav-item">
              <Link
                href={`/${link.toLowerCase()}`}
                onClick={() => {
                  handleNavClick(`/${link.toLowerCase()}`);
                }}
                className={`nav-link ${isActive(`/${link.toLowerCase()}`)}`}
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
        <Link href='./register' >Register </Link>
      </div>
    </nav>
  );
};

export default Navbar;
