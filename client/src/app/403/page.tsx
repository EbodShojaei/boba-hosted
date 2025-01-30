"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="py-16">
      <div className="max-w-md mx-auto text-center">
        <Alert variant="destructive" className="mb-6 flex items-center gap-4">
          <AlertTriangleIcon className="text-destructive w-6 h-6" />
          <h2 className="text-xl font-semibold">403 - Forbidden</h2>
        </Alert>
        <p className="mb-8 text-gray-700">
          Sorry, you don&apos;t have permission to access this page.
        </p>
        <Link href="/">
          <Button variant="default">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
