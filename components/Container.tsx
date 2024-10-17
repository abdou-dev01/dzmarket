"use client";

import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        `max-w-[2520px] mx-auto px-2 sm:px-4 md:mx-10 lg:px-20`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
