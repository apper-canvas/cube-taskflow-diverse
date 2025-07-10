import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import CalendarWidget from "@/components/organisms/CalendarWidget";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskModal from "@/components/organisms/TaskModal";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";

const TaskListPage = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTaskCompletion, loadTasks } = useTasks();
  const { categories } = useCategories();
  
const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && !task.completed) ||
                           (statusFilter === "completed" && task.completed);
      
      const matchesCategory = categoryFilter === "all" || 
                             selectedCategory === "all" ||
                             task.categoryId === categoryFilter ||
                             task.categoryId === selectedCategory;
      
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, selectedCategory]);

  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    return { totalTasks, activeTasks, completedTasks };
  }, [tasks]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.Id, taskData);
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = await toggleTaskCompletion(taskId);
      if (task.completed) {
        toast.success("Task completed! 🎉");
      } else {
        toast.info("Task marked as active");
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Update filters based on category selection
    if (categoryId === "all") {
      setStatusFilter("all");
      setCategoryFilter("all");
    } else if (categoryId === "active") {
      setStatusFilter("active");
      setCategoryFilter("all");
    } else if (categoryId === "completed") {
      setStatusFilter("completed");
      setCategoryFilter("all");
    } else {
      setStatusFilter("all");
      setCategoryFilter(categoryId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-80">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            totalTasks={taskStats.totalTasks}
            activeTasks={taskStats.activeTasks}
            completedTasks={taskStats.completedTasks}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            totalTasks={taskStats.totalTasks}
            activeTasks={taskStats.activeTasks}
            completedTasks={taskStats.completedTasks}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
{/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                <p className="text-gray-600">
                  {filteredTasks.length} of {tasks.length} tasks
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon name="List" className="w-4 h-4 mr-1.5 inline" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      viewMode === "calendar"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-1.5 inline" />
                    Calendar
                  </button>
                </div>
                <Button onClick={handleOpenModal}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <FilterBar
                statusFilter={statusFilter}
                onStatusChange={(e) => setStatusFilter(e.target.value)}
                categoryFilter={categoryFilter}
                onCategoryChange={(e) => setCategoryFilter(e.target.value)}
                priorityFilter={priorityFilter}
                onPriorityChange={(e) => setPriorityFilter(e.target.value)}
                categories={categories}
              />
            </div>

{/* Task Content */}
            {viewMode === "list" ? (
              <TaskList
                tasks={filteredTasks}
                loading={loading}
                error={error}
                categories={categories}
                onTaskToggle={handleToggleTask}
                onTaskEdit={handleEditTask}
                onTaskDelete={handleDeleteTask}
                onRetry={loadTasks}
              />
            ) : (
              <CalendarWidget
                tasks={filteredTasks}
                loading={loading}
                error={error}
                categories={categories}
                onTaskToggle={handleToggleTask}
                onTaskEdit={handleEditTask}
                onTaskDelete={handleDeleteTask}
                onRetry={loadTasks}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        categories={categories}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  );
};

export default TaskListPage;