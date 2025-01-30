import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { PlayerMLB } from "@/types/players";
import { Query, DocumentData } from "firebase-admin/firestore";

const MAX_LIMIT = 100;
const VALID_SORT_FIELDS = [
  "season",
  "team.name",
  "stat.war",
  "stat.mWar",
  "stat.mWarError",
] as const;
type ValidSortField = (typeof VALID_SORT_FIELDS)[number];

function getNestedValue(obj: PlayerMLB, path: string): any {
  return path
    .split(".")
    .reduce((acc, part) => acc && acc[part as keyof typeof acc], obj as any);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    const limit = Math.min(
      parseInt(params.get("limit") || "30", 10),
      MAX_LIMIT,
    );

    const sortField = params.get("sortField") || "season";
    if (!VALID_SORT_FIELDS.includes(sortField as ValidSortField)) {
      return NextResponse.json(
        { error: "Invalid sort field" },
        { status: 400 },
      );
    }

    const sortOrder = params.get("sortOrder") === "desc" ? "desc" : "asc";
    const cursor = params.get("cursor");

    let queryRef: Query<DocumentData> = adminDb.collection("mlb_players");

    if (sortField.includes(".")) {
      const [parent, child] = sortField.split(".");
      queryRef = queryRef.orderBy(`${parent}.${child}`, sortOrder);
    } else {
      queryRef = queryRef.orderBy(sortField, sortOrder);
    }

    if (cursor) {
      const cursorValue = [
        "season",
        "stat.war",
        "stat.mWar",
        "stat.mWarError",
      ].includes(sortField)
        ? parseFloat(cursor)
        : cursor;
      queryRef = queryRef.startAfter(cursorValue);
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 10000),
    );

    const queryPromise = queryRef.limit(limit + 1).get();
    const snapshot = (await Promise.race([
      queryPromise,
      timeoutPromise,
    ])) as FirebaseFirestore.QuerySnapshot<DocumentData>;

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PlayerMLB[];

    let nextCursor: string | number | null = null;
    if (docs.length > limit) {
      const lastDoc = docs.pop()!;
      nextCursor = sortField.includes(".")
        ? getNestedValue(lastDoc, sortField)
        : lastDoc[sortField as keyof PlayerMLB];
    }

    return NextResponse.json({
      data: docs,
      nextCursor: nextCursor?.toString() || null,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
