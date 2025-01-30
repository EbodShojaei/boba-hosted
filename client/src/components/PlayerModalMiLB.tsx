"use client";

import Image from "next/image";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { PlayerMiLB } from "@/types/players";
import { useTeamLogo } from "../hooks/useTeamLogos";

interface PlayerModalMiLBProps {
  player: PlayerMiLB;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerModalMiLB({
  player,
  isOpen,
  onClose,
}: PlayerModalMiLBProps) {
  // Fallback for the player image
  const playerImage = player.image
    ? `data:image/jpeg;base64,${player.image}`
    : "/default-player.jpg";

  // Get the team image from local storage or fallback
  const teamImage = useTeamLogo(player?.team?.id);

  const mWarChange = player.stat.mWarChange;
  const trendColor =
    mWarChange !== null && mWarChange >= 0 ? "text-green-500" : "text-red-500";
  const trendIcon = mWarChange !== null && mWarChange >= 0 ? "↑" : "↓";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="max-w-sm" aria-describedby="milb-player-info">
        <DialogHeader>
          <DialogTitle>
            <div className="relative w-14 h-14 overflow-hidden">
              <Image
                src={teamImage}
                alt={player.team?.name ?? "No Team"}
                fill
                className="object-contain"
              />
            </div>
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="px-4 rounded-md">
          <div className="flex items-center justify-center mb-4 gap-2">
            <span className="text-2xl font-bold text-gray-800">
              #{player.rank}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {player.fullName}
            </h2>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40 rounded-full overflow-hidden">
              <Image
                src={playerImage}
                alt={player.fullName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Games Played:</strong> {player.stat.gamesPlayed}
            </p>
            <p>
              <strong>Wins:</strong> {player.stat.wins}
            </p>
            <p>
              <strong>Losses:</strong> {player.stat.losses}
            </p>
            <p>
              <strong>Innings Pitched:</strong> {player.stat.inningsPitched}
            </p>
            <p>
              <strong>Strikeouts:</strong> {player.stat.strikeOuts}
            </p>
            <p>
              <strong>Shutouts:</strong> {player.stat.shutouts}
            </p>
            <p>
              <strong>bWAR:</strong> {player.stat.mWar}
            </p>
            {mWarChange !== null && (
              <p>
                <strong>bWAR Change:</strong>{" "}
                <span className={`${trendColor} font-semibold`}>
                  {trendIcon} {mWarChange}
                </span>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
