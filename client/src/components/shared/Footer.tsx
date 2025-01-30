"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModalContact from "@/components/ModalContact";
import DeveloperProfiles from "@/components/DeveloperProfiles";
import { ThemeToggle } from "./ThemeToggle";
import NavLinks from "./NavLinks";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <footer className="bg-blue-600 py-8 px-10 mt-8">
      <div className="grid grid-cols-3 gap-8 justify-between">
        <div className="flex flex-col space-y-4">
          <Button onClick={openModal} className="self-start">
            Contact Us
          </Button>
          <DeveloperProfiles />
        </div>

        <div className="flex flex-col justify-center items-center">
          <Link href="/">
            <Image
              src="/boba-logo.jpg"
              alt="Boba Logo"
              width={100}
              height={100}
              className="rounded-full cursor-pointer"
            />
          </Link>
          <div className="text-center mt-4">
            <p className="text-4xl font-bold">Boba</p>
            <p className="text-xl font-thin mt-2">Building Smarter Gameplans</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 items-end">
          <ThemeToggle />
          <NavLinks className="flex flex-col space-y-2 items-end" />
        </div>
      </div>
      <ModalContact isOpen={isOpen} onClose={closeModal} />
    </footer>
  );
}
