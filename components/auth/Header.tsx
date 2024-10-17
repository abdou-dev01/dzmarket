"use client";

import { cn } from "@/lib/utils";
import React from "react";

const Header = ({ label, title }: { label?: string; title?: string }) => {
  return (
    <div className="w-full flex justify-center items-center flex-col space-y-4 text-center ">
      {title && (
        <h1
          className={cn(
            "text-xl font-semibold capitalize sm:text-2xl md:text-3xl"
          )}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {title}
        </h1>
      )}
      <p className="text-muted-foreground text-sm capitalize">{label}</p>
    </div>
  );
};

export default Header;
