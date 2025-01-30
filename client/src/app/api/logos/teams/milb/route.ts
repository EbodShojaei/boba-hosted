import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("milb_team_logos").get();
    const logos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: logos });
  } catch (error) {
    console.error("Error fetching team logos:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
