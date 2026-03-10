export interface TaskDto {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface GetTaskParams {
  id: number;
}

export interface CreateTaskDto {
  userId: number;
  title: string;
  completed?: boolean;
}

export interface UpdateTaskDto {
  id: number;
  title?: string;
  completed?: boolean;
  userId?: number;
}

export interface DeleteTaskDto {
  id: number;
}
