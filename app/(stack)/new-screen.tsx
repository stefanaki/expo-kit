import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { TasksList, useTasks } from '@/features/tasks';
import { useTranslation } from 'react-i18next';

export default function NewScreen() {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useTasks();

  return (
    <View className="bg-background flex-1 p-2">
      {isLoading && <Text>{t('newScreen.loading')}</Text>}
      {isError && <Text>{t('newScreen.errorLoadingData')}</Text>}
      {data && <TasksList tasks={data} />}
    </View>
  );
}
