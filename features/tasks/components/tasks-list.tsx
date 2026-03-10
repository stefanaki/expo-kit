import { FlatList, View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { TaskDto } from '@/features/tasks/types';
import { TaskItem } from '@/features/tasks/components/task-item';

type TasksListProps = {
  tasks: TaskDto[];
  selectedTaskId?: number | null;
  onSelectTask?: (task: TaskDto) => void;
};

export function TasksList({ tasks, selectedTaskId, onSelectTask }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <View className="border-border items-center justify-center rounded-lg border border-dashed p-6">
        <Text variant="muted">No tasks available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-3"
      renderItem={({ item }) => (
        <TaskItem task={item} isSelected={selectedTaskId === item.id} onPress={onSelectTask} />
      )}
    />
  );
}
