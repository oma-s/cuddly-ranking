import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

import { Colors, StatColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatMeter } from '@/src/components/StatMeter';
import { useToysContext } from '@/src/context/ToysContext';
import { confirmAction } from '@/src/utils/confirm';

export default function ToyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToy, deleteToy } = useToysContext();
  const toy = id ? getToy(id) : undefined;
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (toy) {
      navigation.setOptions({ title: toy.name });
    }
  }, [navigation, toy]);

  if (!toy) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.missingText, { color: theme.text }]}>Toy not found.</Text>
      </View>
    );
  }

  const stats = [
    { key: 'strength', label: 'Strength', value: toy.strength },
    { key: 'speed', label: 'Speed', value: toy.speed },
    { key: 'smartness', label: 'Smartness', value: toy.smartness },
  ] as const;

  const handleDelete = async () => {
    const confirmed = await confirmAction('Delete Toy', `Remove ${toy.name} from your crew?`);
    if (!confirmed) return;
    await deleteToy(toy.id);
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View style={[styles.avatar, { borderColor: theme.border }]}>
            {toy.photoUri ? (
              <Image source={{ uri: toy.photoUri }} style={styles.photo} contentFit="cover" />
            ) : (
              <Text style={[styles.avatarInitials, { color: theme.text }]}>
                {toy.name
                  .split(' ')
                  .map((n) => n.charAt(0))
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>{toy.name}</Text>
            {toy.description ? (
              <Text style={[styles.description, { color: `${theme.text}bb` }]}>{toy.description}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: `${theme.text}aa` }]}>All Points</Text>
          <Text style={[styles.totalValue, { color: StatColors.all }]}>
            {toy.strength + toy.speed + toy.smartness}
          </Text>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, gap: 16 }]}>
        {stats.map((stat) => (
          <StatMeter key={stat.key} label={stat.label} value={stat.value} statKey={stat.key} />
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push({ pathname: '/(tabs)/toys/form', params: { id: toy.id } })}>
          <Text style={styles.actionText}>Edit Toy</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: '#1d1d29', opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleDelete}>
          <Text style={[styles.actionText, { color: '#ffcbcb' }]}>Delete Toy</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 120,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
