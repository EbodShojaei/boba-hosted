"use client";

import { useState, useEffect } from "react";
import { PlayerMiLB } from "@/types/players";

const MAX_LIMIT = 100;

type ValidSortField = "rank" | "lastName" | "team.name" | "stat.mWar";

function getPlayersByID(): Record<string, PlayerMiLB> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("milbPlayersById");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function makeCacheKey(
  cursor: string | null,
  sortField: string,
  sortOrder: string,
) {
  const c = cursor || "start";
  return `milb_${c}_sort_${sortField}_${sortOrder}`;
}

function retrieveFromCache(key: string) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { sortedIDs, nextCursor } = JSON.parse(cached);
    const playersByID = getPlayersByID();
    const cachedPlayers = sortedIDs
      .map((id: string) => playersByID[id])
      .filter(Boolean);

    if (cachedPlayers.length === sortedIDs.length) {
      return { players: cachedPlayers, nextCursor };
    }
    return null;
  } catch {
    return null;
  }
}

function storePlayers(
  fetchedPlayers: PlayerMiLB[],
  currentCursor: string | null,
  sortField: string,
  sortOrder: string,
  nextCursor: string | null,
) {
  // 1. Merge into playersByID
  const playersByID = getPlayersByID();
  fetchedPlayers.forEach((p) => {
    playersByID[p.id] = p;
  });
  localStorage.setItem("milbPlayersById", JSON.stringify(playersByID));

  // 2. Store sorted IDs & cursor
  const key = makeCacheKey(currentCursor, sortField, sortOrder);
  localStorage.setItem(
    key,
    JSON.stringify({
      sortedIDs: fetchedPlayers.map((p) => p.id),
      nextCursor,
    }),
  );
}

/**
 * Hook to manage MiLB players data with pagination, sorting, and caching.
 */
export function useMilbPlayers() {
  const [players, setPlayers] = useState<PlayerMiLB[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<ValidSortField>("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const limit = 30;

  const loadPlayers = async () => {
    setLoading(true);

    // 1. Check cache
    const cacheKey = makeCacheKey(currentCursor, sortField, sortOrder);
    const cached = retrieveFromCache(cacheKey);

    if (cached) {
      setPlayers(cached.players);
      setNextCursor(cached.nextCursor);
      setLoading(false);
      return;
    }

    // 2. Not cached, fetch from API
    try {
      const params = new URLSearchParams({
        limit: Math.min(limit, MAX_LIMIT).toString(),
        sortField,
        sortOrder,
      });
      if (currentCursor) {
        params.set("cursor", currentCursor);
      }

      const res = await fetch(`/api/players/milb?${params}`);
      const result = await res.json();

      if (res.ok) {
        setPlayers(result.data);
        setNextCursor(result.nextCursor || null);

        // 3. Store results in localStorage
        storePlayers(
          result.data,
          currentCursor,
          sortField,
          sortOrder,
          result.nextCursor,
        );
      } else {
        console.error("Non-OK response fetching players:", result);
      }
    } catch (error) {
      console.error("Error fetching MiLB players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCursor, sortField, sortOrder]);

  function handleSort(field: ValidSortField) {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCursorHistory([]);
    setCurrentCursor(null);
  }

  function handleNext() {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
    }
  }

  function handlePrevious() {
    if (cursorHistory.length > 0) {
      const history = [...cursorHistory];
      const prevCursor = history.pop() || null;
      setCursorHistory(history);
      setCurrentCursor(prevCursor);
    }
  }

  return {
    players,
    loading,
    sortField,
    sortOrder,
    handleSort,
    handleNext,
    handlePrevious,
    cursorHistory,
    currentCursor,
    nextCursor,
  };
}
