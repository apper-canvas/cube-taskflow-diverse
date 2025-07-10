import React from "react";
import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const variants = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const dots = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variants[priority],
      className
    )}>
      <span className={cn("w-2 h-2 rounded-full mr-1.5", dots[priority])} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

export default PriorityBadge;