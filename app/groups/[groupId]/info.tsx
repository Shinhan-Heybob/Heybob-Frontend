import { GroupInfoScreen } from '@/src/features/group-info/ui/GroupInfoScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function GroupInfoPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  if (!groupId || Array.isArray(groupId)) {
    return null;
  }

  return <GroupInfoScreen groupId={groupId} />;
}