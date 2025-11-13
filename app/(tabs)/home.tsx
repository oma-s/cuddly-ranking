import { useRouter } from 'expo-router';

import { WelcomeLanding } from '@/src/components/WelcomeLanding';

export default function HomeTabScreen() {
  const router = useRouter();

  return (
    <WelcomeLanding
      onViewToys={() => router.replace('/(tabs)/toys')}
      onSeeRankings={() => router.replace('/(tabs)/rankings')}
    />
  );
}
