import { GroupInfoDetailScreen } from '@/src/features/group-create/ui/GroupInfoDetailScreen';
import { useLocalSearchParams } from 'expo-router';

export default function GroupDetailPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  return <GroupInfoDetailScreen groupId={groupId || 'default'} />;
}