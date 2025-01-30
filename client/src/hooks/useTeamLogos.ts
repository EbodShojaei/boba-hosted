"use client";

import { useState, useEffect } from "react";

export function useTeamLogo(teamId?: string): string {
  const [teamImage, setTeamImage] = useState("/default-team.png");

  useEffect(() => {
    if (teamId) {
      const storedLogos = localStorage.getItem("milbTeamLogos");
      if (storedLogos) {
        try {
          const logoMap = JSON.parse(storedLogos);
          const foundLogo = logoMap[teamId];
          if (foundLogo) {
            setTeamImage(`data:image/png;base64,${foundLogo}`);
            return;
          }
        } catch (error) {
          console.error("Error parsing team logos from localStorage:", error);
        }
      }
    }
    // If no teamId or logo found, fallback to default
    setTeamImage("/default-team.png");
  }, [teamId]);

  return teamImage;
}

export function useTeamLogos() {
  const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});
  const [logosLoading, setLogosLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check if already cached
    const cached = localStorage.getItem("milbTeamLogos");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setTeamLogos(parsed);
        setLogosLoading(false);
        return; // No need to fetch again
      } catch (err) {
        console.warn("Failed to parse teamLogos from localStorage:", err);
      }
    }

    // 2. If not cached, fetch from the Next.js route
    (async () => {
      try {
        const res = await fetch("/api/logos/teams/milb");
        if (!res.ok) {
          throw new Error(`Failed to fetch team logos. Status: ${res.status}`);
        }
        const { data } = await res.json();

        // Convert array to a map: { [teamId]: base64jpeg }
        const logoMap: Record<string, string> = {};
        data.forEach((doc: any) => {
          if (doc.id) {
            logoMap[doc.id] = doc.image || "";
          }
        });

        // 3. Cache in localStorage
        localStorage.setItem("milbTeamLogos", JSON.stringify(logoMap));
        // 4. Update state
        setTeamLogos(logoMap);
      } catch (error) {
        console.error("Error fetching team logos:", error);
      } finally {
        setLogosLoading(false);
      }
    })();
  }, []);

  return { teamLogos, logosLoading };
}
