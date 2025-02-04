"use client";

import React from "react";
import Image from "next/image";
import LeaderboardMLB from "@/components/LeaderboardMLB";

export default function About() {
  return (
    <div className="py-8 px-10">
      <h1 className="text-2xl font-bold mb-6">About bWAR vs WAR</h1>
      <main>
        <p className="mb-4">
          Our Boba WAR (bWAR) is compared to the traditional{" "}
          <a
            href="https://www.mlb.com/glossary/advanced-stats/wins-above-replacement#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            WAR
          </a>{" "}
          metric to determine the accuracy of our WAR machine based on MLB
          pitcher data. The histogram below shows this accuracy (R² = 98%).
        </p>
        <Image
          src="/bwar_histogram.jpg"
          alt="bWAR Accuracy Histogram"
          width={600}
          height={400}
          className="mx-auto my-10 block rounded-lg w-auto h-auto"
        />
        <LeaderboardMLB />
      </main>
    </div>
  );
}
