
"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/utils/trpc";

export function TaskList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const observerTarget = useRef<HTMLDivElement>(null);

  const [successMessage, setSuccessMessage] = useState("");

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.list.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  // Handles task deletion and resets the paginated list after success.
const deleteTask = useMutation(
  trpc.delete.mutationOptions({
    onSuccess: async () => {
      // Display a success message after deletion.
      setSuccessMessage("Task deleted successfully!");

      // Reset the pagination to prevent offset inconsistencies.
      await queryClient.resetQueries({
        queryKey: trpc.list.infiniteQueryKey({ limit: 10 }),
      });
    },
    onError: () => {
      // Clear the success message when deletion fails.
      setSuccessMessage("");
    },
  })
);

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");
    deleteTask.mutate({ id });
  }

  // Observes the end of the list and loads the next page.
  // Observes the list boundary and requests additional pages when visible.
useEffect(() => {
  const target = observerTarget.current;

  // Skip observation when there are no more pages to load.
  if (!target || !hasNextPage || isFetchingNextPage) {
    return;
  }

  const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];

    // Loads the next page before the user reaches the actual end.
    if (entry?.isIntersecting) {
      fetchNextPage({ cancelRefetch: false });
    }
  },
  {
    root: null,
    rootMargin: "200px",
    threshold: 0,
  }
);

  observer.observe(target);

  // Disconnect the observer when the component updates or unmounts.
  return () => observer.disconnect();
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Could not load tasks: {error.message}
      </p>
    );
  }

  const tasks = data.pages.flatMap((page) => page.items);

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">
        Your Tasks ({tasks.length})
      </h2>

      {successMessage && (
        <p className="mb-4 text-green-600">{successMessage}</p>
      )}

      {deleteTask.isError && (
        <p className="mb-4 text-red-600">
          Could not delete task: {deleteTask.error.message}
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="text-gray-500">
          No tasks found. Create your first task!
        </p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4"
            >
              <div>
                <h3 className="font-semibold">{task.title}</h3>

                {task.description && (
                  <p className="mt-2 text-gray-600">
                    {task.description}
                  </p>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Created:{" "}
                  {new Date(task.creationDate).toLocaleString("en-US")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`/tasks/${task.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Edit
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteTask.isPending}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  {deleteTask.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
        {/* Detects when the user reaches the end of the task list. */}
      <div
        ref={observerTarget}
        className="py-6 text-center"
      >
        
        {isFetchingNextPage && <p>Loading more tasks...</p>}

        {!hasNextPage && tasks.length > 0 && (
          <p className="text-sm text-gray-500">
            You have reached the end of the list.
          </p>
        )}
      </div>
    </section>
  );
}
