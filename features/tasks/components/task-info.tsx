import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { TaskDto } from '@/features/tasks/types';

type TaskInfoProps = {
  task: TaskDto;
};

export function TaskInfo({ task }: TaskInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle numberOfLines={2}>{task.title}</CardTitle>
        <CardDescription>Task details</CardDescription>
      </CardHeader>
      <CardContent className="gap-1">
        <Text variant="small">ID: {task.id}</Text>
        <Text variant="small">User: {task.userId}</Text>
        <Text variant="small">Status: {task.completed ? 'Completed' : 'Open'}</Text>
      </CardContent>
    </Card>
  );
}
