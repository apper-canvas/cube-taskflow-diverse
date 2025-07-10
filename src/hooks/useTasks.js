import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError("Failed to create task. Please try again.");
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === parseInt(id) ? updatedTask : task
        ));
        return updatedTask;
      }
    } catch (err) {
      setError("Failed to update task. Please try again.");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.Id !== parseInt(id)));
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      throw err;
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === parseInt(id) ? updatedTask : task
        ));
        return updatedTask;
      }
    } catch (err) {
      setError("Failed to update task completion. Please try again.");
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
};