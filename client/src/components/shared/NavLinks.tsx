"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  className?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <div className={className}>
      <Link
        href="/"
        className={`${pathname === "/" ? "underline font-bold" : "hover:underline"}`}
      >
        Home
      </Link>
      <Link
        href="/about"
        className={`${pathname === "/about" ? "underline font-bold" : "hover:underline"}`}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={`${pathname === "/contact" ? "underline font-bold" : "hover:underline"}`}
      >
        Contact
      </Link>
    </div>
  );
};

export default NavLinks;
