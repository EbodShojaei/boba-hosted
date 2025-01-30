"use client";

import { useMlbPlayers } from "@/hooks/useMlbPlayers";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

export default function LeaderboardMLB() {
  const {
    players,
    loading,
    sortField,
    sortOrder,
    handleSort,
    handleNext,
    handlePrevious,
    cursorHistory,
    nextCursor,
  } = useMlbPlayers();

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                onClick={() => handleSort("season")}
                className="cursor-pointer w-[20%] text-center"
              >
                Year{" "}
                {sortField === "season" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell className="w-[20%]">Player</TableCell>
              <TableCell className="w-[20%]">
                Team{" "}
                {sortField === "team.name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("stat.war")}
                className="cursor-pointer w-[10%] text-center"
              >
                WAR{" "}
                {sortField === "stat.war" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("stat.mWar")}
                className="cursor-pointer w-[15%] text-center"
              >
                bWAR{" "}
                {sortField === "stat.mWar" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("stat.mWarError")}
                className="cursor-pointer w-[15%] text-center"
              >
                bWAR Error{" "}
                {sortField === "stat.mWarError" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} className="h-20">
                <TableCell className="text-center">{player.season}</TableCell>
                <TableCell>{player.fullName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{player.team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {player.stat.war.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {player.stat.mWar.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {player.stat.mWarError.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  );
}
