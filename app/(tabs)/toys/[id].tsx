import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { AccentGradients, Colors, StatColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatMeter } from "@/src/components/StatMeter";
import { useToysContext } from "@/src/context/ToysContext";
import { confirmAction } from "@/src/utils/confirm";

export default function ToyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToy, deleteToy } = useToysContext();
  const toy = id ? getToy(id) : undefined;
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const primaryButtonTextColor = colorScheme === "dark" ? "#0b0612" : "#fff";
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (toy) {
      navigation.setOptions({ title: toy.name });
    }
  }, [navigation, toy]);

  if (!toy) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.missingText, { color: theme.text }]}>
          Konnte nichts finden.
        </Text>
      </View>
    );
  }

  const stats = [
    { key: "strength", label: "Stärke", value: toy.strength },
    { key: "speed", label: "Geschwindigkeit", value: toy.speed },
    { key: "smartness", label: "Smartness", value: toy.smartness },
  ] as const;

  const handleDelete = async () => {
    const confirmed = await confirmAction(
      "Wirklich Löschen",
      `${toy.name} wirklich aus deiner Crew entfernen?`
    );
    if (!confirmed) return;
    await deleteToy(toy.id);
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="View full photo"
            onPress={() => setShowImage(true)}
            style={({ pressed }) => [
              styles.avatar,
              {
                borderColor: theme.border,
                transform: [{ scale: pressed ? 0.97 : 1 }],
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
                  .map((n) => n.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            )}
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {toy.name}
            </Text>
            {toy.description ? (
              <Text style={[styles.description, { color: `${theme.text}bb` }]}>
                {toy.description}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: `${theme.text}aa` }]}>
            Alle Punkte
          </Text>
          <Text style={[styles.totalValue, { color: StatColors.all }]}>
            {toy.strength + toy.speed + toy.smartness}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border, gap: 16 },
        ]}
      >
        {stats.map((stat) => (
          <StatMeter
            key={stat.key}
            label={stat.label}
            value={stat.value}
            statKey={stat.key}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/toys/form",
              params: { id: toy.id },
            })
          }
        >
          <LinearGradient
            colors={AccentGradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButtonGradient}
          >
            <Text style={[styles.actionText, { color: primaryButtonTextColor }]}>
              Bearbeiten
            </Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.actionButtonSolid,
            { backgroundColor: "#1d1d29", opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionText, { color: "#ffcbcb" }]}>Löschen</Text>
        </Pressable>
      </View>
      <Modal visible={showImage} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowImage(false)}>
          <View style={styles.modalOverlay}>
            {toy.photoUri ? (
              <View style={styles.fullImageFrame}>
                <Image
                  source={{ uri: toy.photoUri }}
                  style={styles.fullImage}
                  contentFit="contain"
                />
              </View>
            ) : (
              <View
                style={[styles.fullImageFrame, styles.fullImagePlaceholder]}
              >
                <Text
                  style={[
                    styles.avatarInitials,
                    { color: "#fff", fontSize: 48 },
                  ]}
                >
                  {toy.name.charAt(0)}
                </Text>
                <Text style={{ color: "#fff", marginTop: 8 }}>
                  Noch kein Foto
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    alignItems: "center",
    justifyContent: "center",
  },
  missingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    fontSize: 32,
    fontWeight: "900",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "900",
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  actionButtonSolid: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  actionText: {
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8,4,15,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  fullImageFrame: {
    width: "100%",
    height: "80%",
    borderRadius: 32,
    backgroundColor: "#05020a",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  fullImagePlaceholder: {
    borderWidth: 2,
    borderColor: "#ffffff55",
  },
});
