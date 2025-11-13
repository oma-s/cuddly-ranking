import { Stack } from 'expo-router';

export default function RankingsStack() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Rankings',
        headerLargeTitle: false,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Rankings' }} />
    </Stack>
  );
}
