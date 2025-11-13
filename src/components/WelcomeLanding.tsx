import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AccentGradients, Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type WelcomeLandingProps = {
  onViewToys: () => void;
  onSeeRankings: () => void;
};

export function WelcomeLanding({
  onViewToys,
  onSeeRankings,
}: WelcomeLandingProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const primaryButtonTextColor = colorScheme === "dark" ? "#0b0612" : "#fff";

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? [theme.charcoal, "#12071e"]
          : ["#fbe8ff", "#fefefe"]
      }
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require("@/assets/images/logo_transparent.png")}
            style={styles.heroImage}
            contentFit="contain"
          />
          <View>
            <Text style={[styles.kicker, { color: theme.tint }]}>
              Wilkommen bei
            </Text>
            <Text style={[styles.title, { color: theme.text }]}>
              Emil&apos;s Crew
            </Text>
            <Text style={[styles.subtitle, { color: `${theme.text}cc` }]}>
              Behalte den genauen Überblick über die gesamte Crew.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Los geht&apos;s
          </Text>
          <Text style={[styles.cardBody, { color: `${theme.text}aa` }]}>
            Wo möchtest du anfangen?
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={onViewToys}
            >
              <LinearGradient
                colors={AccentGradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: primaryButtonTextColor },
                  ]}
                >
                  Crew
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: theme.tint,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={onSeeRankings}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.tint }]}>
                Rankings
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 32,
    gap: 32,
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    gap: 16,
  },
  heroImage: {
    width: 260,
    height: 260,
  },
  kicker: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textAlign: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 0.8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  cardBody: {
    fontSize: 15,
  },
  actions: {
    marginTop: 12,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
