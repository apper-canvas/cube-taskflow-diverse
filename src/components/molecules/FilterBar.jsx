import React from "react";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FilterBar = ({ 
  statusFilter, 
  onStatusChange, 
  categoryFilter, 
  onCategoryChange, 
  priorityFilter, 
  onPriorityChange, 
  categories = [],
  className 
}) => {
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
        <Select value={statusFilter} onChange={onStatusChange}>
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
        <Select value={categoryFilter} onChange={onCategoryChange}>
          <option value="all">All Categories</option>
{categories.map(category => (
            <option key={category.Id} value={category.Id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Priority</label>
        <Select value={priorityFilter} onChange={onPriorityChange}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;