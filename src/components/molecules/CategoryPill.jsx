import React from "react";
import { cn } from "@/utils/cn";

const CategoryPill = ({ category, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm",
        className
      )}
      style={{
        backgroundColor: `${category.color}15`,
        color: category.color,
        borderColor: `${category.color}30`
      }}
    >
      {category.name}
    </span>
  );
};

export default CategoryPill;