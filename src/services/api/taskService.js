import tasksData from "@/services/mockData/tasks.json";
import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];
let categories = [...categoriesData];

export const taskService = {
  async getAllTasks() {
    await delay(250);
    return [...tasks];
  },

  async getTaskById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  },

async createTask(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      isRecurring: taskData.isRecurring || false,
      recurrencePattern: taskData.recurrencePattern || null,
      recurrenceStartDate: taskData.recurrenceStartDate || null,
      recurrenceEndDate: taskData.recurrenceEndDate || null,
      specificDays: taskData.specificDays || []
    };
    tasks.push(newTask);
    await this.updateCategoryCount(newTask.categoryId);
    return { ...newTask };
  },

async updateTask(id, updates) {
    await delay(250);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const oldCategoryId = tasks[index].categoryId;
      
      // Ensure recurring fields are properly updated
      const updatedData = {
        ...updates,
        isRecurring: updates.isRecurring !== undefined ? updates.isRecurring : tasks[index].isRecurring,
        recurrencePattern: updates.recurrencePattern !== undefined ? updates.recurrencePattern : tasks[index].recurrencePattern,
        recurrenceStartDate: updates.recurrenceStartDate !== undefined ? updates.recurrenceStartDate : tasks[index].recurrenceStartDate,
        recurrenceEndDate: updates.recurrenceEndDate !== undefined ? updates.recurrenceEndDate : tasks[index].recurrenceEndDate,
        specificDays: updates.specificDays !== undefined ? updates.specificDays : tasks[index].specificDays
      };
      
      tasks[index] = { ...tasks[index], ...updatedData };
      
      // Update category counts if category changed
      if (oldCategoryId !== updates.categoryId) {
        await this.updateCategoryCount(oldCategoryId);
        await this.updateCategoryCount(updates.categoryId);
      }
      
      return { ...tasks[index] };
    }
    return null;
  },

  async deleteTask(id) {
    await delay(200);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      await this.updateCategoryCount(deletedTask.categoryId);
      return true;
    }
    return false;
  },

  async toggleTaskCompletion(id) {
    await delay(200);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const wasCompleted = tasks[index].completed;
      tasks[index].completed = !wasCompleted;
      tasks[index].completedAt = !wasCompleted ? new Date().toISOString() : null;
      return { ...tasks[index] };
    }
    return null;
  },

  async updateCategoryCount(categoryId) {
    const category = categories.find(cat => cat.Id === parseInt(categoryId));
    if (category) {
      const taskCount = tasks.filter(task => task.categoryId === categoryId && !task.completed).length;
      category.taskCount = taskCount;
    }
  }
};

export const categoryService = {
  async getAllCategories() {
    await delay(200);
    return [...categories];
  },

  async getCategoryById(id) {
    await delay(150);
    const category = categories.find(cat => cat.Id === parseInt(id));
    return category ? { ...category } : null;
  },

  async createCategory(categoryData) {
    await delay(250);
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id)) + 1,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async updateCategory(id, updates) {
    await delay(200);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      return { ...categories[index] };
    }
    return null;
  },

  async deleteCategory(id) {
    await delay(200);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index !== -1) {
      categories.splice(index, 1);
      return true;
    }
    return false;
  }
};