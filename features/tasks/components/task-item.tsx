import { Pressable, View } from 'react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { TaskDto } from '@/features/tasks/types';

type TaskItemProps = {
  task: TaskDto;
  isSelected?: boolean;
  onPress?: (task: TaskDto) => void;
};

export function TaskItem({ task, isSelected = false, onPress }: TaskItemProps) {
  return (
    <Pressable onPress={() => onPress?.(task)}>
      <Card className={cn(isSelected && 'border-primary')}>
        <CardContent className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-sm font-medium" numberOfLines={1}>
              {task.title}
            </Text>
            <Text variant="muted">#{task.id}</Text>
          </View>
          <View
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              task.completed ? 'bg-emerald-500' : 'bg-amber-500'
            )}
          />
        </CardContent>
      </Card>
    </Pressable>
  );
}
