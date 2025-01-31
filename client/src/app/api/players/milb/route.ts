import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { PlayerMiLB } from "@/types/players";
import { Query, DocumentData, FieldPath } from "firebase-admin/firestore";

const MAX_LIMIT = 100;
const VALID_SORT_FIELDS = [
  "rank",
  "lastName",
  "team.name",
  "stat.mWar",
] as const;
type ValidSortField = (typeof VALID_SORT_FIELDS)[number];

// Helper function to get nested object value
function getNestedValue(obj: PlayerMiLB, path: string): any {
  return path
    .split(".")
    .reduce((acc, part) => acc && acc[part as keyof typeof acc], obj as any);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    // Validate and sanitize inputs
    const limit = Math.min(
      parseInt(params.get("limit") || "30", 10),
      MAX_LIMIT,
    );

    const sortField = params.get("sortField") || "rank";
    if (!VALID_SORT_FIELDS.includes(sortField as ValidSortField)) {
      return NextResponse.json(
        { error: "Invalid sort field" },
        { status: 400 },
      );
    }

    const sortOrder = params.get("sortOrder") === "desc" ? "desc" : "asc";
    const cursor = params.get("cursor");

    // Start with collection reference
    let queryRef: Query<DocumentData> = adminDb.collection("milb_players");

    // Handle nested field sorting
    if (sortField.includes(".")) {
      const [parent, child] = sortField.split(".");
      queryRef = queryRef.orderBy(`${parent}.${child}`, sortOrder);
    } else {
      queryRef = queryRef.orderBy(sortField, sortOrder);
    }

    // Secondary ordering by document ID to ensure uniqueness
    queryRef = queryRef.orderBy(FieldPath.documentId(), sortOrder);

    if (cursor) {
      let cursorObj;
      try {
        cursorObj = JSON.parse(cursor);
        if (
          typeof cursorObj !== "object" ||
          cursorObj === null ||
          !("value" in cursorObj) ||
          !("id" in cursorObj)
        ) {
          throw new Error("Invalid cursor structure");
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid cursor format" },
          { status: 400 },
        );
      }

      const { value, id } = cursorObj;

      // Apply cursor for pagination
      queryRef = queryRef.startAfter(value, id);
    }

    // Add timeout protection
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
    })) as PlayerMiLB[];

    let nextCursor: string | null = null;
    if (docs.length > limit) {
      const lastDoc = docs.pop()!;
      const sortFieldValue = sortField.includes(".")
        ? getNestedValue(lastDoc, sortField)
        : lastDoc[sortField as keyof PlayerMiLB];

      nextCursor = JSON.stringify({
        value: sortFieldValue,
        id: lastDoc.id,
      });
    }

    return NextResponse.json({
      data: docs,
      nextCursor: nextCursor,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        },
      },
      { status: 500 },
    );
  }
}
