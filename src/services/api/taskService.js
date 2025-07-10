import { toast } from "react-toastify";

export const taskService = {
  async getAllTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "is_recurring" } },
          { field: { Name: "recurrence_pattern" } },
          { field: { Name: "recurrence_start_date" } },
          { field: { Name: "recurrence_end_date" } },
          { field: { Name: "specific_days" } },
          { field: { Name: "category_id" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title || task.Name,
        description: task.description || "",
        categoryId: task.category_id?.toString() || "",
        priority: task.priority || "medium",
        dueDate: task.due_date || null,
        completed: task.completed === "true" || task.completed === true,
        createdAt: task.created_at || new Date().toISOString(),
        completedAt: task.completed_at || null,
        isRecurring: task.is_recurring === "true" || task.is_recurring === true,
        recurrencePattern: task.recurrence_pattern || null,
        recurrenceStartDate: task.recurrence_start_date || null,
        recurrenceEndDate: task.recurrence_end_date || null,
        specificDays: task.specific_days ? task.specific_days.split(',') : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getTaskById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "is_recurring" } },
          { field: { Name: "recurrence_pattern" } },
          { field: { Name: "recurrence_start_date" } },
          { field: { Name: "recurrence_end_date" } },
          { field: { Name: "specific_days" } },
          { field: { Name: "category_id" } }
        ]
      };

      const response = await apperClient.getRecordById("task", parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      const task = response.data;
      // Map database fields to UI expected format
      return {
        Id: task.Id,
        title: task.title || task.Name,
        description: task.description || "",
        categoryId: task.category_id?.toString() || "",
        priority: task.priority || "medium",
        dueDate: task.due_date || null,
        completed: task.completed === "true" || task.completed === true,
        createdAt: task.created_at || new Date().toISOString(),
        completedAt: task.completed_at || null,
        isRecurring: task.is_recurring === "true" || task.is_recurring === true,
        recurrencePattern: task.recurrence_pattern || null,
        recurrenceStartDate: task.recurrence_start_date || null,
        recurrenceEndDate: task.recurrence_end_date || null,
        specificDays: task.specific_days ? task.specific_days.split(',') : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async createTask(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI format to database fields (only Updateable fields)
      const dbTask = {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || "medium",
        due_date: taskData.dueDate || null,
        completed: taskData.completed ? "true" : "false",
        created_at: new Date().toISOString(),
        is_recurring: taskData.isRecurring ? "true" : "false",
        recurrence_pattern: taskData.recurrencePattern || null,
        recurrence_start_date: taskData.recurrenceStartDate || null,
        recurrence_end_date: taskData.recurrenceEndDate || null,
        specific_days: Array.isArray(taskData.specificDays) ? taskData.specificDays.join(',') : "",
        category_id: parseInt(taskData.categoryId)
      };

      const params = {
        records: [dbTask]
      };

      const response = await apperClient.createRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newTask = successfulRecords[0].data;
          // Map database response to UI format
          return {
            Id: newTask.Id,
            title: newTask.title || newTask.Name,
            description: newTask.description || "",
            categoryId: newTask.category_id?.toString() || "",
            priority: newTask.priority || "medium",
            dueDate: newTask.due_date || null,
            completed: newTask.completed === "true" || newTask.completed === true,
            createdAt: newTask.created_at || new Date().toISOString(),
            completedAt: newTask.completed_at || null,
            isRecurring: newTask.is_recurring === "true" || newTask.is_recurring === true,
            recurrencePattern: newTask.recurrence_pattern || null,
            recurrenceStartDate: newTask.recurrence_start_date || null,
            recurrenceEndDate: newTask.recurrence_end_date || null,
            specificDays: newTask.specific_days ? newTask.specific_days.split(',') : []
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateTask(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI format to database fields (only Updateable fields)
      const dbUpdates = {
        Id: parseInt(id)
      };

      if (updates.title !== undefined) {
        dbUpdates.Name = updates.title;
        dbUpdates.title = updates.title;
      }
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed ? "true" : "false";
      if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
      if (updates.isRecurring !== undefined) dbUpdates.is_recurring = updates.isRecurring ? "true" : "false";
      if (updates.recurrencePattern !== undefined) dbUpdates.recurrence_pattern = updates.recurrencePattern;
      if (updates.recurrenceStartDate !== undefined) dbUpdates.recurrence_start_date = updates.recurrenceStartDate;
      if (updates.recurrenceEndDate !== undefined) dbUpdates.recurrence_end_date = updates.recurrenceEndDate;
      if (updates.specificDays !== undefined) {
        dbUpdates.specific_days = Array.isArray(updates.specificDays) ? updates.specificDays.join(',') : "";
      }
      if (updates.categoryId !== undefined) dbUpdates.category_id = parseInt(updates.categoryId);

      const params = {
        records: [dbUpdates]
      };

      const response = await apperClient.updateRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          // Map database response to UI format
          return {
            Id: updatedTask.Id,
            title: updatedTask.title || updatedTask.Name,
            description: updatedTask.description || "",
            categoryId: updatedTask.category_id?.toString() || "",
            priority: updatedTask.priority || "medium",
            dueDate: updatedTask.due_date || null,
            completed: updatedTask.completed === "true" || updatedTask.completed === true,
            createdAt: updatedTask.created_at || new Date().toISOString(),
            completedAt: updatedTask.completed_at || null,
            isRecurring: updatedTask.is_recurring === "true" || updatedTask.is_recurring === true,
            recurrencePattern: updatedTask.recurrence_pattern || null,
            recurrenceStartDate: updatedTask.recurrence_start_date || null,
            recurrenceEndDate: updatedTask.recurrence_end_date || null,
            specificDays: updatedTask.specific_days ? updatedTask.specific_days.split(',') : []
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async deleteTask(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async toggleTaskCompletion(id) {
    try {
      // First get the current task
      const currentTask = await this.getTaskById(id);
      if (!currentTask) return null;

      // Toggle completion and set completed_at timestamp
      const updates = {
        completed: !currentTask.completed,
        completedAt: !currentTask.completed ? new Date().toISOString() : null
      };

      return await this.updateTask(id, updates);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling task completion:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};

export const categoryService = {
  async getAllCategories() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords("category", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name,
        color: category.color || "#5B21B6",
        taskCount: category.task_count || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getCategoryById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } }
        ]
      };

      const response = await apperClient.getRecordById("category", parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      const category = response.data;
      // Map database fields to UI expected format
      return {
        Id: category.Id,
        name: category.Name,
        color: category.color || "#5B21B6",
        taskCount: category.task_count || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async createCategory(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI format to database fields (only Updateable fields)
      const dbCategory = {
        Name: categoryData.name,
        color: categoryData.color || "#5B21B6",
        task_count: 0
      };

      const params = {
        records: [dbCategory]
      };

      const response = await apperClient.createRecord("category", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newCategory = successfulRecords[0].data;
          // Map database response to UI format
          return {
            Id: newCategory.Id,
            name: newCategory.Name,
            color: newCategory.color || "#5B21B6",
            taskCount: newCategory.task_count || 0
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateCategory(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI format to database fields (only Updateable fields)
      const dbUpdates = {
        Id: parseInt(id)
      };

      if (updates.name !== undefined) dbUpdates.Name = updates.name;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.taskCount !== undefined) dbUpdates.task_count = updates.taskCount;

      const params = {
        records: [dbUpdates]
      };

      const response = await apperClient.updateRecord("category", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          // Map database response to UI format
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.Name,
            color: updatedCategory.color || "#5B21B6",
            taskCount: updatedCategory.task_count || 0
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async deleteCategory(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("category", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};