import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AccentGradients, Colors, StatColors, StatGradients } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useToysContext } from "@/src/context/ToysContext";
import { RANKING_CATEGORIES, RankingCategory } from "@/src/types/toy";

export default function RankingsScreen() {
  const { getRanking } = useToysContext();
  const [category, setCategory] = useState<RankingCategory>("strength");
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const rankings = getRanking(category, 10);

  const renderRow = ({
    item,
    index,
  }: {
    item: ReturnType<typeof getRanking>[number];
    index: number;
  }) => {
    const initials = item.name
      .split(" ")
      .map((piece) => piece.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <View
        style={[
          styles.row,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View
          style={[
            styles.rankBadge,
            { backgroundColor: StatColors[category] ?? theme.tint },
          ]}
        >
          <Text style={[styles.rankText, { color: "#0a0412" }]}>
            {index + 1}
          </Text>
        </View>
        <View style={[styles.avatar, { borderColor: theme.border }]}>
          {item.photoUri ? (
            <Image
              source={{ uri: item.photoUri }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <Text style={[styles.avatarInitials, { color: theme.text }]}>
              {initials}
            </Text>
          )}
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowName, { color: theme.text }]}>
            {item.name}
          </Text>
          <Text
            style={[styles.rowDetail, { color: `${theme.text}88` }]}
            numberOfLines={1}
          >
            {item.description || "No description yet"}
          </Text>
        </View>
        <View
          style={[
            styles.scoreBadge,
            {
              borderColor: StatColors[category],
              backgroundColor: `${StatColors[category]}18`,
            },
          ]}
        >
          <Text style={[styles.scoreValue, { color: StatColors[category] }]}>
            {category === "all"
              ? item.strength + item.speed + item.smartness
              : item[category]}
          </Text>
        </View>
      </View>
    );
  };

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
            <Text style={[styles.title, { color: theme.text }]}>🏆 Top 10</Text>
            <Text style={[styles.subtitle, { color: `${theme.text}aa` }]}>
              Wähle eine Kategorie, um zu sehen, wer die Crew anführt.
            </Text>
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
                        borderColor: selected ? "transparent" : theme.border,
                        backgroundColor: selected ? "transparent" : theme.card,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    {selected ? (
                      <LinearGradient
                        colors={
                          StatGradients[option.key] ??
                          AccentGradients.primary
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.categoryChipGradient}
                      >
                        <Text
                          style={[styles.categoryText, styles.categoryTextSelected]}
                        >
                          {option.emoji} {option.label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.categoryChipInner}>
                        <Text style={[styles.categoryText, { color: theme.text }]}>
                          {option.emoji} {option.label}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              Füge deiner Crew Mitglieder hinzu, um die Rangliste zu sehen.
            </Text>
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
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  categoryChipInner: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryChipGradient: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryText: {
    fontWeight: "700",
  },
  categoryTextSelected: {
    color: "#0b0515",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontWeight: "900",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "800",
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowName: {
    fontSize: 18,
    fontWeight: "800",
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
    fontWeight: "900",
  },
  empty: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
