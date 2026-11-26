"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@/server/task-store";
import { useTRPC } from "@/utils/trpc";

interface TaskFormProps {
  initialTask?: Task;
}

export function TaskForm({ initialTask }: TaskFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? ""
  );

    // Handles task creation and refreshes the first page after success.
    const createTask = useMutation(
      trpc.create.mutationOptions({
        onSuccess: async () => {
          // Clear the form fields after successful creation.
          setTitle("");
          setDescription("");

          // Reset the infinite query to reload its first page.
          await queryClient.resetQueries({
            queryKey: trpc.list.infiniteQueryKey({ limit: 10 }),
          });
        },
      })
    );

  const updateTask = useMutation(
    trpc.update.mutationOptions({
      onSuccess: async () => {
        // Reset the task list to keep pagination consistent after updates.
        await queryClient.resetQueries({
        queryKey: trpc.list.infiniteQueryKey({ limit: 10 }),
        });

        if (initialTask) {
          await queryClient.invalidateQueries({
            queryKey: trpc.getById.queryKey({ id: initialTask.id }),
          });
        }

        router.push("/");
      },
    })
  );

  const isPending = createTask.isPending || updateTask.isPending;
  const error = createTask.error ?? updateTask.error;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const taskTitle = title.trim();

    if (!taskTitle) {
      return;
    }

    const taskDescription = description.trim() || undefined;

    if (initialTask) {
      updateTask.mutate({
        id: initialTask.id,
        title: taskTitle,
        description: taskDescription,
      });
      return;
    }

    createTask.mutate({
      title: taskTitle,
      description: taskDescription,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block font-medium">
          Title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block font-medium">
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter task description"
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error.message}
        </p>
      )}

      {/* Displays a success message after task creation. */}
        {createTask.isSuccess && !isEditing && (
        <p className="text-sm text-green-600">
            Task created successfully!
        </p>
        )}

      <button
        type="submit"
        disabled={isPending || !title.trim()}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending
          ? "Saving..."
          : isEditing
            ? "Update task"
            : "Create task"}
      </button>
    </form>
  );
}