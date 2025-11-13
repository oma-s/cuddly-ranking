import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, StatColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToysContext } from '@/src/context/ToysContext';
import { RANKING_CATEGORIES, RankingCategory } from '@/src/types/toy';

export default function RankingsScreen() {
  const { getRanking } = useToysContext();
  const [category, setCategory] = useState<RankingCategory>('strength');
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const rankings = getRanking(category, 10);

  const renderRow = ({ item, index }: { item: ReturnType<typeof getRanking>[number]; index: number }) => (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.rankBadge}>
        <Text style={[styles.rankText, { color: theme.background }]}>{index + 1}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.rowDetail, { color: `${theme.text}88` }]} numberOfLines={1}>
          {item.description || 'No description yet'}
        </Text>
      </View>
      <View style={[styles.scoreBadge, { borderColor: StatColors[category], backgroundColor: `${StatColors[category]}18` }]}>
        <Text style={[styles.scoreValue, { color: StatColors[category] }]}>
          {category === 'all'
            ? item.strength + item.speed + item.smartness
            : item[category]}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={rankings}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Top 10 Leaderboard</Text>
            <Text style={[styles.subtitle, { color: `${theme.text}aa` }]}>Choose a stat to see who rules the block.</Text>
            <View style={styles.categoryRow}>
              {RANKING_CATEGORIES.map((option) => {
                const selected = option.key === category;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setCategory(option.key)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      {
                        backgroundColor: selected ? StatColors[option.key] ?? theme.tint : theme.card,
                        borderColor: selected ? StatColors[option.key] ?? theme.tint : theme.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.categoryText,
                        { color: selected ? '#0b0515' : theme.text },
                      ]}>
                      {option.emoji} {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.text }]}>Add toys to see rankings.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 140,
    gap: 16,
  },
  header: {
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryText: {
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#08040f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontWeight: '900',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowName: {
    fontSize: 18,
    fontWeight: '800',
  },
  rowDetail: {
    fontSize: 12,
  },
  scoreBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  empty: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
