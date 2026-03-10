import { create } from 'zustand';

export type TaskFilter = 'all' | 'open' | 'completed';

interface TasksUiState {
  selectedTaskId: number | null;
  filter: TaskFilter;
  searchTerm: string;
  setSelectedTaskId: (id: number | null) => void;
  setFilter: (filter: TaskFilter) => void;
  setSearchTerm: (searchTerm: string) => void;
  reset: () => void;
}

const initialState = {
  selectedTaskId: null,
  filter: 'all' as TaskFilter,
  searchTerm: '',
};

export const useTasksStore = create<TasksUiState>((set) => ({
  ...initialState,
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setFilter: (filter) => set({ filter }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  reset: () => set(initialState),
}));
