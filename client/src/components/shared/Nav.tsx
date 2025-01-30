"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import NavLinks from "./NavLinks";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600">
      <Link href="/">
        <Image
          src="/boba-logo.jpg"
          alt="Boba Logo"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
        />
      </Link>
      <NavLinks className="flex space-x-6" />
      <ThemeToggle />
    </nav>
  );
}
