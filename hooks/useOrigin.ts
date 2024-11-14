"use client";

import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);
  let origin;

  useEffect(() => {
    setIsMounted(true);
    origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
  }, []);

  if (!isMounted) return "";

  return origin;
};
