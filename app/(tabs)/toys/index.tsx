import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ToyListItem } from "@/src/components/ToyListItem";
import { useToysContext } from "@/src/context/ToysContext";

export default function ToysIndexScreen() {
  const { toys, loading } = useToysContext();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const primaryButtonTextColor = colorScheme === "dark" ? "#0b0612" : "#fff";

  const sortedToys = useMemo(
    () =>
      [...toys].sort((a, b) => {
        if (b.strength !== a.strength) return b.strength - a.strength;
        return a.name.localeCompare(b.name);
      }),
    [toys]
  );

  const renderItem = ({ item }: { item: (typeof toys)[number] }) => (
    <ToyListItem
      toy={item}
      onPress={() =>
        router.push({ pathname: "/(tabs)/toys/[id]", params: { id: item.id } })
      }
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={sortedToys}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={[styles.overline, { color: theme.tint }]}>
                Deine Crew
              </Text>
              <Text style={[styles.title, { color: theme.text }]}>
                Emil&apos;s Ranking
              </Text>
              <Text style={[styles.subtitle, { color: `${theme.text}aa` }]}>
                Klicke auf ein Crewmitglied, um es zu bearbeiten und die
                Statistiken anzuzeigen.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/toys/form")}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: theme.tint,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.addButtonText,
                  { color: primaryButtonTextColor },
                ]}
              >
                + Hinzufügen
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.tint} />
            ) : (
              <>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  Noch keine Crewmitglieder
                </Text>
                <Text
                  style={[styles.emptySubtitle, { color: `${theme.text}80` }]}
                >
                  Beginne damit, deine Crew zu erstellen, indem du das erste
                  Mitglied hinzufügst.
                </Text>
              </>
            )}
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
  listContent: {
    padding: 24,
    paddingBottom: 120,
    gap: 16,
  },
  header: {
    gap: 16,
    marginBottom: 12,
  },
  overline: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  addButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  addButtonText: {
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  emptySubtitle: {
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
