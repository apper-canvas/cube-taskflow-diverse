import React from "react";
import { motion } from "framer-motion";
import { format, isToday, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import CategoryPill from "@/components/molecules/CategoryPill";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, category, onToggle, onEdit, onDelete }) => {
  const handleToggle = () => {
    onToggle(task.Id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.Id);
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border-l-4",
        task.completed ? "opacity-75" : "",
        isOverdue ? "border-l-red-500" : isDueToday ? "border-l-yellow-500" : "border-l-gray-200"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <motion.button
            onClick={handleToggle}
            className={cn(
              "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              task.completed
                ? "bg-accent border-accent text-white"
                : "border-gray-300 hover:border-accent"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Check" className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={cn(
                "text-lg font-semibold",
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              )}>
                {task.title}
              </h3>
              {category && <CategoryPill category={category} />}
              <PriorityBadge priority={task.priority} />
            </div>

            {task.description && (
              <p className={cn(
                "text-sm mb-2",
                task.completed ? "text-gray-400" : "text-gray-600"
              )}>
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <div className="flex items-center space-x-2 text-sm">
                <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                <span className={cn(
                  isOverdue ? "text-red-600 font-medium" : 
                  isDueToday ? "text-yellow-600 font-medium" : "text-gray-500"
                )}>
                  {isOverdue ? "Overdue: " : isDueToday ? "Due today: " : "Due: "}
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="p-2 hover:bg-gray-100"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-2 hover:bg-red-100 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;