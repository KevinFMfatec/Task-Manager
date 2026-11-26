
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "./trpc";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./task-store";

// Validation of the data used to create a task
const createTaskSchema = z.object({
  title: z.string().trim().min(1, "The title is required"),
  description: z.string().optional(),
});

// Validation of the data used to update a task
const updateTaskSchema = z.object({
  id: z.uuid("Invalid ID"),
  title: z.string().trim().min(1, "The title cannot be left empty").optional(),
  description: z.string().optional(),
}).refine(
  (data) => data.title !== undefined || data.description !== undefined,
  { message: "Provide at least one field to update" }
);

const listTasksSchema = z.object({
  limit: z.number().min(1).max(50).default(10),
  cursor: z.number().min(0).default(0),
});

// Groups all operations related to the tasks
export const appRouter = router({
  // List all tasks
  list: publicProcedure
  .input(listTasksSchema)
  .query(({ input }) => {
    const tasks = getTasks();

    const items = tasks.slice(
      input.cursor,
      input.cursor + input.limit
    );

    const nextCursor =
      input.cursor + items.length < tasks.length
        ? input.cursor + items.length
        : undefined;

    return {
      items,
      nextCursor,
    };
  }),

  // Search for a specific task
  getById: publicProcedure
    .input(z.object({
      id: z.uuid(),
    }))
    .query(({ input }) => {
      const task = getTaskById(input.id);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      return task;
    }),

  // Create a new task
  create: publicProcedure
    .input(createTaskSchema)
    .mutation(({ input }) => {
      return createTask(input);
    }),

  // Updates an existing task
  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(({ input }) => {
      const { id, ...data } = input;

      const task = updateTask(id, data);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Unable to update: task not found",
        });
      }

      return task;
    }),

  // Deletes an existing task
  delete: publicProcedure
    .input(z.object({
      id: z.uuid(),
    }))
    .mutation(({ input }) => {
      const deleted = deleteTask(input.id);

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not delete: task not found",
        });
      }

      return {
        success: true,
        message: "Task successfully deleted",
      };
    }),
});

// Exports the API type for use in the frontend
export type AppRouter = typeof appRouter;
