"use client";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function DeveloperProfiles() {
  return (
    <div className="mt-8">
      <h2 className="text-xl mb-4">Meet the Devs</h2>

      <div className="mb-6">
        <p className="font-bold">Ebod Shojaei</p>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/dev-ebod.jpg" alt="Developer Ebod Shojaei" />
            <AvatarFallback>ES</AvatarFallback>
          </Avatar>
          <div className="flex space-x-2">
            <Link
              href="https://www.linkedin.com/in/ets95/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={24} />
            </Link>
            <Link
              href="https://github.com/ebodshojaei/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={24} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-bold">Rebecca Jeon</p>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/dev-becca.jpg" alt="Developer Rebecca Jeon" />
            <AvatarFallback>RJ</AvatarFallback>
          </Avatar>
          <div className="flex space-x-2">
            <Link
              href="https://www.linkedin.com/in/rebecca-jeon-/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={24} />
            </Link>
            <Link
              href="https://github.com/rebecca-jeon/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
