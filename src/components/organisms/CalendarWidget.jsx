import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isPast,
  isSameDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  parseISO
} from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CategoryPill from "@/components/molecules/CategoryPill";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const CalendarWidget = ({
  tasks = [],
  loading = false,
  error = null,
  categories = [],
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onRetry
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month"); // "day", "week", "month"

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        try {
          const date = parseISO(task.dueDate);
          const dateKey = format(date, "yyyy-MM-dd");
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(task);
        } catch (err) {
          console.warn("Invalid date format for task:", task.Id, task.dueDate);
        }
      }
    });
    return grouped;
  }, [tasks]);

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === parseInt(categoryId)) || null;
  };

  // Navigation functions
  const navigateDate = (direction) => {
    if (calendarView === "day") {
      setCurrentDate(prev => direction === "next" ? addDays(prev, 1) : subDays(prev, 1));
    } else if (calendarView === "week") {
      setCurrentDate(prev => direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  // Get date range based on view
  const getDateRange = () => {
    if (calendarView === "day") {
      return [currentDate];
    } else if (calendarView === "week") {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      });
    } else {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      });
    }
  };

  // Get display title
  const getDisplayTitle = () => {
    if (calendarView === "day") {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    } else if (calendarView === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  const dateRange = getDateRange();

  // Task item component
  const TaskItem = ({ task, compact = false }) => {
    const category = getCategoryById(task.categoryId);
    const isOverdue = isPast(parseISO(task.dueDate)) && !task.completed;
    const isDueToday = isToday(parseISO(task.dueDate));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm",
          task.completed && "opacity-60",
          isOverdue && !task.completed && "border-red-200 bg-red-50",
          isDueToday && !task.completed && "border-blue-200 bg-blue-50",
          compact ? "p-2" : "p-3"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <button
              onClick={() => onTaskToggle(task.Id)}
              className={cn(
                "w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 transition-colors",
                task.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-400"
              )}
            >
              {task.completed && (
                <ApperIcon name="Check" className="w-3 h-3" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm leading-tight",
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              )}>
                {task.title}
              </h4>
              
              {!compact && task.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-1">
                {category && (
                  <CategoryPill category={category} size="sm" />
                )}
                <PriorityBadge priority={task.priority} size="sm" />
                <span className="text-xs text-gray-500">
                  {format(parseISO(task.dueDate), "HH:mm")}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTaskEdit(task)}
              className="w-6 h-6 p-0"
            >
              <ApperIcon name="Edit2" className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTaskDelete(task.Id)}
              className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
            >
              <ApperIcon name="Trash2" className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {getDisplayTitle()}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
              className="w-8 h-8 p-0"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="px-3"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
              className="w-8 h-8 p-0"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["day", "week", "month"].map((view) => (
            <button
              key={view}
              onClick={() => setCalendarView(view)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                calendarView === view
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      {calendarView === "month" ? (
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {dateRange.map((date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const dayTasks = tasksByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);
            
            return (
              <div
                key={dateKey}
                className={cn(
                  "min-h-24 p-2 border border-gray-100 bg-white",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isCurrentDay && "bg-blue-50 border-blue-200"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isCurrentDay && "text-blue-600"
                )}>
                  {format(date, "d")}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <TaskItem key={task.Id} task={task} compact />
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : calendarView === "week" ? (
        <div className="grid grid-cols-7 gap-4">
          {dateRange.map((date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const dayTasks = tasksByDate[dateKey] || [];
            const isCurrentDay = isToday(date);
            
            return (
              <div key={dateKey} className="space-y-3">
                <div className={cn(
                  "text-center py-2 px-3 rounded-lg font-medium",
                  isCurrentDay ? "bg-blue-100 text-blue-800" : "text-gray-700"
                )}>
                  <div className="text-xs uppercase tracking-wide">
                    {format(date, "EEE")}
                  </div>
                  <div className="text-lg">
                    {format(date, "d")}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayTasks.map((task) => (
                    <TaskItem key={task.Id} task={task} />
                  ))}
                  {dayTasks.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Day view
        <div className="space-y-4">
          {(() => {
            const dateKey = format(currentDate, "yyyy-MM-dd");
            const dayTasks = tasksByDate[dateKey] || [];
            
            if (dayTasks.length === 0) {
              return (
                <Empty
                  title="No tasks for this day"
                  description="You have no tasks scheduled for this date."
                />
              );
            }
            
            return dayTasks.map((task) => (
              <TaskItem key={task.Id} task={task} />
            ));
          })()}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;