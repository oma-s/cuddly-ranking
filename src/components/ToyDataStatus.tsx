import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ToyDataStatusProps = {
  status: 'loading' | 'error' | 'missing';
  onRetry?: () => void;
};

export function ToyDataStatus({ status, onRetry }: ToyDataStatusProps) {
  const theme = Colors[useColorScheme() ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color={theme.tint} accessibilityLabel="Crew wird geladen" />
      ) : (
        <Text accessibilityLiveRegion="polite" style={[styles.text, { color: theme.text }]}>
          {status === 'error' ? 'Deine Crew konnte nicht geladen werden.' : 'Dieses Crewmitglied wurde nicht gefunden.'}
        </Text>
      )}
      {status === 'error' && onRetry && (
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
          <Text style={[styles.text, { color: theme.tint }]}>Erneut versuchen</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  text: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  button: { padding: 12 },
});
