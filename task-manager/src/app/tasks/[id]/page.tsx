import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { TaskForm } from "@/app/task-form";
import { appRouter } from "@/server/router";

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Loads the selected task and renders the editing form
export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  // Creates a server-side caller to access tRPC procedures directly
  const caller = appRouter.createCaller({});

  let task;

  try {
    task = await caller.getById({ id });
  } catch (error) {
    // Displays the 404 page when the requested task does not exist
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }

    throw error;
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Edit task</h1>

      <TaskForm initialTask={task} />
    </main>
  );
}
