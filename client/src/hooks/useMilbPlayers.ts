"use client";

import { useState, useEffect } from "react";
import { PlayerMiLB } from "@/types/players";

const MAX_LIMIT = 100;

type ValidSortField = "rank" | "lastName" | "team.name" | "stat.mWar";

/**
 * Safely retrieves the "milbPlayersById" from localStorage.
 */
function getPlayersByID(): Record<string, PlayerMiLB> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("milbPlayersById");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Constructs a cache key based on cursor/sort parameters.
 */
function makeCacheKey(
  cursor: string | null,
  sortField: string,
  sortOrder: string,
) {
  const c = cursor || "start";
  return `milb_${c}_sort_${sortField}_${sortOrder}`;
}

/**
 * Attempts to retrieve cached players and nextCursor from localStorage.
 */
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
 * Stores fetched players in localStorage: both by ID (for quick retrieval)
 * and as sorted lists keyed by the cache key.
 */
function storePlayers(
  fetchedPlayers: PlayerMiLB[],
  currentCursor: string | null,
  sortField: string,
  sortOrder: string,
  nextCursorVal: string | null,
) {
  try {
    // 1. Merge into playersByID
    const playersByID = getPlayersByID();
    fetchedPlayers.forEach((p) => {
      playersByID[p.id] = p;
    });
    localStorage.setItem("milbPlayersById", JSON.stringify(playersByID));

    // 2. Store sorted IDs & nextCursor
    const key = makeCacheKey(currentCursor, sortField, sortOrder);
    localStorage.setItem(
      key,
      JSON.stringify({
        sortedIDs: fetchedPlayers.map((p) => p.id),
        nextCursor: nextCursorVal, // This should be a JSON string or null
      }),
    );
  } catch (error) {
    console.warn("Cache storage failed:", error);
  }
}

/**
 * Evicts cache entries from localStorage, keeping only the specified keys.
 * @param keysToKeep Array of cache keys that should be retained.
 */
function evictCache(keysToKeep: string[]) {
  try {
    const prefix = "milb_"; // Prefix used in makeCacheKey
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(prefix) && !keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Cache eviction failed:", error);
  }
}

/**
 * Custom hook that manages fetching and caching MiLB players with pagination & sorting.
 */
export function useMilbPlayers() {
  // Players data
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

  /**
   * Prefetch a page given its cursor.
   * @param cursor The cursor for the page to prefetch.
   */
  async function prefetchPage(cursor: string | null) {
    if (!cursor) return;

    const prefetchKey = makeCacheKey(cursor, sortField, sortOrder);

    // Check if the page is already cached
    if (retrieveFromCache(prefetchKey)) {
      return; // Already cached, no need to prefetch
    }

    try {
      const params = new URLSearchParams({
        limit: Math.min(limit, MAX_LIMIT).toString(),
        sortField,
        sortOrder,
        cursor: cursor, // Pass the composite cursor as a JSON string
      });

      const res = await fetch(`/api/players/milb?${params}`);
      const result = await res.json();

      if (res.ok) {
        storePlayers(
          result.data,
          cursor,
          sortField,
          sortOrder,
          result.nextCursor, // This should be a JSON string or null
        );
      } else {
        console.error("Server error prefetching MiLB players:", result);
      }
    } catch (error) {
      console.error("Network error prefetching MiLB players:", error);
    }
  }

  /**
   * Load players for the current page and prefetch the next and previous pages.
   */
  async function loadPlayers() {
    setLoading(true);

    // 1. Attempt to load from cache
    const cacheKey = makeCacheKey(currentCursor, sortField, sortOrder);
    const cached = retrieveFromCache(cacheKey);
    if (cached) {
      setPlayers(cached.players);
      setNextCursor(cached.nextCursor);
      setLoading(false);

      // Pre-fetch the next page if nextCursor exists
      if (cached.nextCursor) {
        prefetchPage(cached.nextCursor);
      }

      // Pre-fetch the previous page if there is a previous cursor
      if (cursorHistory.length > 0) {
        const previousCursor = cursorHistory[cursorHistory.length - 1] || null;
        prefetchPage(previousCursor);
      }

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

      const res = await fetch(`/api/players/milb?${params}`);
      const result = await res.json();

      if (res.ok) {
        setPlayers(result.data);
        setNextCursor(result.nextCursor || null);

        // Store results in localStorage
        storePlayers(
          result.data,
          currentCursor,
          sortField,
          sortOrder,
          result.nextCursor,
        );

        // Pre-fetch the next page if nextCursor exists
        if (result.nextCursor) {
          prefetchPage(result.nextCursor);
        }

        // Pre-fetch the previous page if there is a previous cursor
        if (cursorHistory.length > 0) {
          const previousCursor =
            cursorHistory[cursorHistory.length - 1] || null;
          prefetchPage(previousCursor);
        }
      } else {
        console.error("Server error fetching MiLB players:", result);
      }
    } catch (error) {
      console.error("Network error fetching MiLB players:", error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Evict cache entries, keeping only the current, previous, and next pages.
   */
  useEffect(() => {
    // Determine the previous cursor
    const previousCursor =
      cursorHistory.length > 0 ? cursorHistory[cursorHistory.length - 1] : null;
    const previousCacheKey = makeCacheKey(previousCursor, sortField, sortOrder);

    // Determine the current cache key
    const currentCacheKey = makeCacheKey(currentCursor, sortField, sortOrder);

    // Determine the next cache key
    const nextCacheKey = nextCursor
      ? makeCacheKey(nextCursor, sortField, sortOrder)
      : null;

    // Compile keys to keep
    const keysToKeep = [currentCacheKey];
    if (previousCacheKey) keysToKeep.push(previousCacheKey);
    if (nextCacheKey) keysToKeep.push(nextCacheKey);

    // Evict other cache entries
    evictCache(keysToKeep);
  }, [currentCursor, sortField, sortOrder, nextCursor, cursorHistory]);

  // Re-run fetch logic whenever cursor or sort changes
  useEffect(() => {
    loadPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCursor, sortField, sortOrder]);

  /**
   * Switch sort field or invert sort order.
   * @param field The field to sort by.
   */
  function handleSort(field: ValidSortField) {
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

  /**
   * Navigate to the next page.
   */
  function handleNext() {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
    }
  }

  /**
   * Navigate to the previous page.
   */
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
