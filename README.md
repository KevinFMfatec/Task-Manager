# Task Manager

A full-stack task management application built with **Next.js 15**, **tRPC**, **TanStack Query**, and **Zod**. The project demonstrates type-safe communication between frontend and backend, server-side rendering, data validation, and task management through CRUD operations.

## Features

- **Create tasks:** Add new tasks with a required title and an optional description.
- **List tasks:** Display registered tasks, with the newest tasks appearing first.
- **Edit tasks:** Update the title and description of existing tasks.
- **Delete tasks:** Remove tasks with a confirmation prompt.
- **Input validation:** Validate task data on the server using Zod.
- **Type-safe API:** Use tRPC to share types between frontend and backend.
- **Server-side rendering:** Prefetch the initial task list on the server.
- **Infinite scrolling:** Load additional tasks automatically as the user reaches the end of the list.
- **User feedback:** Display loading, success, and error messages during operations.

## Technologies

| Technology                                             | Purpose                                   |
| ------------------------------------------------------ | ----------------------------------------- |
| [Next.js 15](https://nextjs.org/)                      | React framework and application routing   |
| [React](https://react.dev/)                            | User interface                            |
| [TypeScript](https://www.typescriptlang.org/)          | Static typing                             |
| [tRPC v11](https://trpc.io/)                           | Type-safe API communication               |
| [TanStack Query v5](https://tanstack.com/query/latest) | Server state management and data fetching |
| [Zod v4](https://zod.dev/)                             | Data validation                           |
| [Tailwind CSS](https://tailwindcss.com/)               | Styling                                   |

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── tasks/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── task-form.tsx
│   └── task-list.tsx
│
├── server/
│   ├── query-client.ts
│   ├── router.ts
│   ├── task-store.ts
│   ├── trpc-server.ts
│   └── trpc.ts
│
└── utils/
    └── trpc.ts
```

### Main Directories

- **`app/`**: Contains application pages, layouts, UI components, and the tRPC API route.
- **`server/`**: Contains the tRPC configuration, API procedures, query client configuration, and in-memory task storage.
- **`utils/`**: Contains the client-side tRPC utilities.

## Task Data Model

Each task follows this structure:

```ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  creationDate: number;
}
```

| Field          | Type     | Description               |
| -------------- | -------- | ------------------------- |
| `id`           | `string` | Unique task identifier    |
| `title`        | `string` | Required task title       |
| `description`  | `string` | Optional task description |
| `creationDate` | `number` | Task creation timestamp   |

## API Procedures

The backend exposes the following tRPC procedures:

| Procedure | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `list`    | Query    | Returns tasks using cursor-based pagination |
| `getById` | Query    | Retrieves a task by its ID                  |
| `create`  | Mutation | Creates a new task                          |
| `update`  | Mutation | Updates an existing task                    |
| `delete`  | Mutation | Deletes a task by its ID                    |

### Validation

Task data is validated on the server using Zod.

- The title is required.
- The title cannot contain only whitespace.
- The description is optional.
- Updates must provide at least one field to modify.

The backend also handles situations such as attempting to retrieve, update, or delete a task that does not exist.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/KevinFMfatec/Task-Manager.git
```

### 2. Navigate to the project directory

```bash
cd Task-Manager
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Open the application

Navigate to:

```text
http://localhost:3000
```

The application should now be running locally.

## Available Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts the development server          |
| `npm run build` | Builds the application for production  |
| `npm run start` | Starts the production server           |
| `npm run lint`  | Runs the configured linting command    |

## Data Storage

This project currently uses **in-memory storage** to keep the implementation simple and focus on the application architecture and API functionality.

Tasks are stored in a server-side array and are available while the server process remains active.

**Important limitations:**

- Data is not persisted between server restarts.
- Tasks may not be shared between separate server instances.
- The application does not currently use an external database.

## Architecture Highlights

### Type-safe communication with tRPC

The frontend communicates with backend procedures through tRPC, allowing TypeScript types to be inferred across the API boundary without manually defining request and response interfaces.

### Server-side rendering and hydration

The initial task list is prefetched on the server using TanStack Query. The resulting state is dehydrated and passed to the client through `HydrationBoundary`, avoiding an unnecessary initial client-side fetch when the prefetched data is available.

### Infinite scrolling

The task list uses TanStack Query's `useInfiniteQuery` together with the browser's `IntersectionObserver` API to fetch additional pages as the user approaches the end of the list.

### Server-side validation

Zod schemas validate incoming data before the backend executes task operations, helping ensure that invalid data does not reach the storage layer.

## Future Improvements

Potential improvements for future iterations include:

- Persistent database integration.
- User authentication and authorization.
- Automated unit and integration tests.
- Task filtering and search.
- Task sorting and prioritization.
- Deployment and production monitoring.

## License

This project was developed for educational and portfolio purposes. Unless otherwise specified, all rights are reserved by the repository owner.
