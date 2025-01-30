"use client";

import LeaderboardMiLB from "@/components/LeaderboardMiLB";

export default function HomePage() {
  return (
    <div className="py-8 px-10">
      <div className="text-center mb-6">
        <p className="text-4xl font-bold">Boba</p>
        <p className="text-xl font-thin mt-2 mb-5">
          Building Smarter Gameplans
        </p>
      </div>
      <h1 className="text-2xl font-bold mb-6">MiLB Pitcher Leaderboard</h1>
      <main className="p-4">
        <LeaderboardMiLB />
      </main>
    </div>
  );
}
