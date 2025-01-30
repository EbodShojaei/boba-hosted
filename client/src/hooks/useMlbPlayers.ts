"use client";

import { useState, useEffect } from "react";
import { PlayerMLB } from "@/types/players";

const MAX_LIMIT = 100;

// Safely get the "mlbPlayersByID" from localStorage
function getPlayersByID(): Record<string, PlayerMLB> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("mlbPlayersByID");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Construct a cache key based on cursor/sort parameters
function makeCacheKey(
  cursor: string | null,
  sortField: string,
  sortOrder: string,
) {
  const c = cursor || "start";
  return `mlb_${c}_sort_${sortField}_${sortOrder}`;
}

// Try retrieving a cached set of players + nextCursor from localStorage
function retrieveFromCache(key: string) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { sortedIDs, nextCursor } = JSON.parse(cached);
    const playersByID = getPlayersByID();
    const cachedPlayers = sortedIDs
      .map((id: string) => playersByID[id])
      .filter(Boolean);

    // Only return if all players exist in localStorage
    if (cachedPlayers.length === sortedIDs.length) {
      return { players: cachedPlayers, nextCursor };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Store fetched players in localStorage: both by ID (for quick retrieval)
 * and as sorted lists keyed by the cache key
 */
function storePlayers(
  fetchedPlayers: PlayerMLB[],
  currentCursor: string | null,
  sortField: string,
  sortOrder: string,
  nextCursorVal: string | null,
) {
  try {
    // Merge into playersByID
    const playersByID = getPlayersByID();
    fetchedPlayers.forEach((p) => {
      playersByID[p.id] = p;
    });
    localStorage.setItem("mlbPlayersByID", JSON.stringify(playersByID));

    // Store sorted IDs & nextCursor
    const key = makeCacheKey(currentCursor, sortField, sortOrder);
    localStorage.setItem(
      key,
      JSON.stringify({
        sortedIDs: fetchedPlayers.map((p) => p.id),
        nextCursor: nextCursorVal,
      }),
    );
  } catch (error) {
    console.warn("Cache storage failed:", error);
  }
}

/**
 * Custom hook that manages fetching and caching MLB players with pagination & sorting.
 */
export function useMlbPlayers() {
  // Players data
  const [players, setPlayers] = useState<PlayerMLB[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<string>("season");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const limit = 30;

  async function loadPlayers() {
    setLoading(true);

    // 1. Attempt to load from cache
    const cacheKey = makeCacheKey(currentCursor, sortField, sortOrder);
    const cached = retrieveFromCache(cacheKey);
    if (cached) {
      setPlayers(cached.players);
      setNextCursor(cached.nextCursor);
      setLoading(false);
      return;
    }

    // 2. Otherwise, fetch from API
    try {
      const params = new URLSearchParams({
        limit: Math.min(limit, MAX_LIMIT).toString(),
        sortField,
        sortOrder,
      });
      if (currentCursor) {
        params.set("cursor", currentCursor);
      }

      const res = await fetch(`/api/players/mlb?${params}`);
      const result = await res.json();

      if (res.ok) {
        setPlayers(result.data);
        setNextCursor(result.nextCursor);

        // Store results in localStorage
        storePlayers(
          result.data,
          currentCursor,
          sortField,
          sortOrder,
          result.nextCursor,
        );
      } else {
        console.error("Server error fetching MLB players:", result);
      }
    } catch (error) {
      console.error("Network error fetching MLB players:", error);
    } finally {
      setLoading(false);
    }
  }

  // Re-run fetch logic whenever cursor or sort changes
  useEffect(() => {
    loadPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCursor, sortField, sortOrder]);

  // Switch sort field or invert sort order
  function handleSort(field: string) {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    // Reset pagination
    setCursorHistory([]);
    setCurrentCursor(null);
  }

  // Go forward
  function handleNext() {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
    }
  }

  // Go backward
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
