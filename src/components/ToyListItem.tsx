import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, StatColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Toy } from "@/src/types/toy";

type ToyListItemProps = {
  toy: Toy;
  onPress?: () => void;
};

export const ToyListItem = memo(({ toy, onPress }: ToyListItemProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const chipData = useMemo(
    () => [
      { label: "💥", value: toy.strength, color: StatColors.strength },
      { label: "⚡️", value: toy.speed, color: StatColors.speed },
      { label: "🧠", value: toy.smartness, color: StatColors.smartness },
    ],
    [toy.speed, toy.smartness, toy.strength]
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.8 : 1, backgroundColor: theme.card },
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            borderColor: theme.border,
            backgroundColor: colorScheme === "dark" ? theme.asphalt : "#fff",
          },
        ]}
      >
        {toy.photoUri ? (
          <Image
            source={{ uri: toy.photoUri }}
            style={styles.photo}
            contentFit="cover"
          />
        ) : (
          <Text style={[styles.avatarInitials, { color: theme.text }]}>
            {toy.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join("")
              .toUpperCase() || "?"}
          </Text>
        )}
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, { color: theme.text }]}>{toy.name}</Text>
        {toy.description ? (
          <Text
            style={[styles.description, { color: `${theme.text}99` }]}
            numberOfLines={2}
          >
            {toy.description}
          </Text>
        ) : null}
        <View style={styles.chips}>
          {chipData.map((chip) => (
            <View
              key={chip.label}
              style={[
                styles.chip,
                { borderColor: chip.color, backgroundColor: `${chip.color}18` },
              ]}
            >
              <Text style={[styles.chipLabel, { color: chip.color }]}>
                {chip.label}
              </Text>
              <Text style={[styles.chipValue, { color: chip.color }]}>
                {chip.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
});
ToyListItem.displayName = "ToyListItem";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#ffffff22",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  chips: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  chipValue: {
    fontSize: 14,
    fontWeight: "800",
  },
});
