"use client";

import React from "react";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="py-8 px-20">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <main>
        <div className="py-10">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
