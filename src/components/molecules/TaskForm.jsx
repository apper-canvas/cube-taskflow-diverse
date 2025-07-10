import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskForm = ({ task, categories, onSubmit, onCancel, className }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: "",
    isRecurring: false,
    recurrencePattern: "daily",
    recurrenceStartDate: "",
    recurrenceEndDate: "",
    specificDays: []
  });

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        categoryId: task.categoryId || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        isRecurring: task.isRecurring || false,
        recurrencePattern: task.recurrencePattern || "daily",
        recurrenceStartDate: task.recurrenceStartDate ? new Date(task.recurrenceStartDate).toISOString().split("T")[0] : "",
        recurrenceEndDate: task.recurrenceEndDate ? new Date(task.recurrenceEndDate).toISOString().split("T")[0] : "",
        specificDays: task.specificDays || []
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      recurrenceStartDate: formData.recurrenceStartDate ? new Date(formData.recurrenceStartDate).toISOString() : null,
      recurrenceEndDate: formData.recurrenceEndDate ? new Date(formData.recurrenceEndDate).toISOString() : null
    };

    onSubmit(submitData);
  };

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSpecificDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day]
    }));
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="">Select a category</option>
{categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          className="mt-1"
        />
</div>

      {/* Recurring Task Configuration */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-3 mb-4">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <Label htmlFor="isRecurring" className="text-base font-medium">
            Make this a recurring task
          </Label>
        </div>

        {formData.isRecurring && (
          <div className="space-y-4 pl-7">
            <div>
              <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
              <Select
                id="recurrencePattern"
                name="recurrencePattern"
                value={formData.recurrencePattern}
                onChange={handleChange}
                className="mt-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="specific">Specific Days</option>
              </Select>
            </div>

            {formData.recurrencePattern === 'specific' && (
              <div>
                <Label>Select Days</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specificDays.includes(day)}
                        onChange={() => handleSpecificDaysChange(day)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recurrenceStartDate">Start Date</Label>
                <Input
                  id="recurrenceStartDate"
                  name="recurrenceStartDate"
                  type="date"
                  value={formData.recurrenceStartDate}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recurrenceEndDate">End Date (Optional)</Label>
                <Input
                  id="recurrenceEndDate"
                  name="recurrenceEndDate"
                  type="date"
                  value={formData.recurrenceEndDate}
                  onChange={handleChange}
                  className="mt-1"
                  min={formData.recurrenceStartDate}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;