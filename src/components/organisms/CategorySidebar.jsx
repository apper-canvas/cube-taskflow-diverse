import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  totalTasks,
  activeTasks,
  completedTasks,
  className 
}) => {
  const sidebarItems = [
    {
      id: "all",
      name: "All Tasks",
      icon: "List",
      count: totalTasks,
      color: "#6B7280"
    },
    {
      id: "active",
      name: "Active",
      icon: "Circle",
      count: activeTasks,
      color: "#5B21B6"
    },
    {
      id: "completed",
      name: "Completed",
      icon: "CheckCircle",
      count: completedTasks,
      color: "#10B981"
    }
  ];

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-4", className)}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onCategorySelect(item.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
                selectedCategory === item.id
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "hover:bg-gray-50 text-gray-700"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={item.icon} 
                  className="w-5 h-5"
                  style={{ color: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">
                {item.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <motion.button
              key={category.Id}
              onClick={() => onCategorySelect(category.Id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
                selectedCategory === category.Id
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "hover:bg-gray-50 text-gray-700"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">
                {category.taskCount}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;