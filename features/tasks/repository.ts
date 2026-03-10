import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api';
import type {
  CreateTaskDto,
  DeleteTaskDto,
  GetTaskParams,
  TaskDto,
  UpdateTaskDto,
} from '@/features/tasks/types';

const TASKS_QUERY_KEY = ['tasks'] as const;
const TODOS_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos';

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<TaskDto[]>(TODOS_ENDPOINT);
      return response.data;
    },
  });
}

export function useTask({ id }: GetTaskParams) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<TaskDto>(`${TODOS_ENDPOINT}/${id}`);
      return response.data;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskDto) => {
      const response = await apiClient.post<TaskDto>(TODOS_ENDPOINT, {
        completed: false,
        ...input,
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTaskDto) => {
      const response = await apiClient.patch<TaskDto>(`${TODOS_ENDPOINT}/${id}`, input);
      return response.data;
    },
    onSuccess: (updatedTask) => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: [...TASKS_QUERY_KEY, updatedTask.id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTaskDto) => {
      await apiClient.delete(`${TODOS_ENDPOINT}/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}
