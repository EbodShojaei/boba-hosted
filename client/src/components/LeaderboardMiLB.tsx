"use client";

import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";
import PlayerModalMiLB from "./PlayerModalMiLB";
import { useMilbPlayers } from "../hooks/useMilbPlayers";
import { useTeamLogos } from "../hooks/useTeamLogos";
import { useState } from "react";
import { PlayerMiLB } from "@/types/players";

export default function LeaderboardMiLB() {
  const {
    players,
    loading: loadingPlayers,
    sortField,
    sortOrder,
    handleSort,
    handleNext,
    handlePrevious,
    cursorHistory,
    nextCursor,
  } = useMilbPlayers();

  const { teamLogos, logosLoading } = useTeamLogos();

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerMiLB | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div>
      {loadingPlayers ? (
        <Spinner />
      ) : (
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="h-12">
              <TableCell
                onClick={() => handleSort("rank")}
                className="cursor-pointer w-[15%] text-center"
              >
                Rank {sortField === "rank" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell className="w-[35%]">Player</TableCell>
              <TableCell className="w-[35%]">Team</TableCell>
              <TableCell className="w-[15%] text-center">bWAR</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => {
              const teamId = player.team?.id;

              // Fallback for missing player image
              const base64Player = player.image
                ? `data:image/jpeg;base64,${player.image}`
                : "/default-player.jpg";

              // Fallback for missing team logo
              const base64Logo =
                teamId && !logosLoading ? teamLogos[teamId] : null;
              const logoToDisplay = base64Logo
                ? `data:image/png;base64,${base64Logo}`
                : "/default-team.png";

              return (
                <TableRow
                  key={player.id}
                  onClick={() => {
                    setSelectedPlayer(player);
                    setModalOpen(true);
                  }}
                  className="cursor-pointer h-20"
                >
                  <TableCell className="text-center align-middle">
                    {player.rank}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2 md:flex-row flex-col">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden md:block hidden">
                        <Image
                          src={base64Player}
                          alt={player.fullName}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
                          className="object-cover object-center"
                        />
                      </div>
                      <span>{player.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2 md:flex-row flex-col">
                      <div className="relative w-11 h-11 overflow-hidden md:block hidden">
                        <Image
                          src={logoToDisplay}
                          alt={player.team?.name ?? "No Team"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
                          className="object-contain object-center"
                        />
                      </div>
                      <span>{player.team?.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center align-middle">
                    {player.stat.mWar.toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <div className="flex items-left justify-center space-x-2 py-4">
        <Button
          className="w-16"
          onClick={handlePrevious}
          disabled={cursorHistory.length === 0}
        >
          Prev.
        </Button>
        <Button className="w-16" onClick={handleNext} disabled={!nextCursor}>
          Next
        </Button>
      </div>

      {selectedPlayer && (
        <PlayerModalMiLB
          player={selectedPlayer}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
