"use client";

import { useState } from "react";
import { BrowsePage } from "@/components/exams/browse-page";

export default function Home() {
  const [dark, setDark] = useState(false);

  return (
    <BrowsePage
      dark={dark}
      setDark={setDark}
    />
  );
}
