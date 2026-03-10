# Feature Module Pattern

This project organizes domain code under `features/<feature-name>`.

A feature should contain:

- `types.ts`: DTOs and feature-level types.
- `repository.ts`: React Query hooks for list/get/create/update/delete operations.
- `store.ts`: Zustand store for UI-only state (selection, local filters, search term, panel open/closed, etc.).
- `components/**/*.tsx`: dumb/presentational components.
- `index.ts`: feature barrel export.
- `components/index.ts`: components barrel export.

## Folder shape

```text
features/
  tasks/
    index.ts
    types.ts
    repository.ts
    store.ts
    components/
      index.ts
      task-item.tsx
      task-info.tsx
      tasks-list.tsx
```

## Responsibilities

### `types.ts` (DTOs)

Keep request and response contracts here. For example, `features/tasks/types.ts` defines:

- `TaskDto`
- `GetTaskParams`
- `CreateTaskDto`
- `UpdateTaskDto`
- `DeleteTaskDto`

Use DTO names that reflect API contracts, not UI concerns.

### `repository.ts` (React Query wrapper)

Keep all server I/O in repository hooks:

- `useTasks()` for list queries
- `useTask(...)` for detail queries
- `useCreateTask()`
- `useUpdateTask()`
- `useDeleteTask()`

Notes:

- Keep query keys local to the feature.
- Invalidate related query keys in mutation `onSuccess` handlers.
- Keep transport details (endpoints, HTTP methods, payload shapes) out of UI components.

### `store.ts` (UI-only Zustand state)

Store only ephemeral UI state here:

- Selected item IDs
- Local filter mode
- Search text
- Modal/drawer open state

Do not duplicate server state from React Query in Zustand.

### `components/` (dumb components)

Presentational components should:

- Receive all data via props.
- Emit callbacks for user actions.
- Avoid direct API calls.
- Avoid owning feature orchestration logic.

Container/screen code should compose repository hooks + store + dumb components.

## Barrel exports

Each feature should expose a simple import surface.

### `features/tasks/components/index.ts`

```ts
export * from './task-info';
export * from './task-item';
export * from './tasks-list';
```

### `features/tasks/index.ts`

```ts
export * from './types';
export * from './store';
export * from './repository';
export * from './components';
```

This enables imports like:

```ts
import {
  useTasks,
  useTask,
  useCreateTask,
  useTasksStore,
  TasksList,
  TaskInfo,
  type TaskDto,
} from '@/features/tasks';
```

## Example API for scaffold/demo

For scaffolding and demos, the tasks repository currently uses JSONPlaceholder:

- Base: `https://jsonplaceholder.typicode.com`
- Resource: `/todos`
- Schema: `{ userId: number; id: number; title: string; completed: boolean }`

This keeps feature structure realistic while avoiding backend coupling during initial setup.
