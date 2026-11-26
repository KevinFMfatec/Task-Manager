import "server-only";

// Represents the format of a task in the system
export interface Task {
  id: string;
  title: string;
  description?: string;
  creationDate: number;
}

// Temporary storage of tasks
// The data exists as long as this module remains loaded on the server
const tasks: Task[] = [];

// Returns all registered tasks
export function getTasks(): Task[] {
  return [...tasks];
}

// Searches for a task by its id
export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

// Create a new task
export function createTask(data: {
  title: string;
  description?: string;
}): Task {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    creationDate: Date.now(),
  };

  // Add the newest task to the beginning of the list.
  tasks.unshift(newTask);

  return newTask;
}

// Updates an existing task
export function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
  },
): Task | undefined {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return undefined;
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...data,
  };

  return tasks[taskIndex];
}

// Deletes a task by its id
export function deleteTask(id: string): boolean {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  return true;
}
