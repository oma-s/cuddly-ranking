import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type WelcomeLandingProps = {
  onViewToys: () => void;
  onSeeRankings: () => void;
};

export function WelcomeLanding({ onViewToys, onSeeRankings }: WelcomeLandingProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const primaryButtonTextColor = colorScheme === 'dark' ? '#0b0612' : '#fff';

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? [theme.charcoal, '#12071e'] : ['#fbe8ff', '#fefefe']}
      style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.heroImage}
            contentFit="contain"
          />
          <View>
            <Text style={[styles.kicker, { color: theme.tint }]}>Welcome to</Text>
            <Text style={[styles.title, { color: theme.text }]}>Cuddly Crew</Text>
            <Text style={[styles.subtitle, { color: `${theme.text}cc` }]}>
              Build your squad of stuffed superheroes, then see who dominates the streets.
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Jump In</Text>
          <Text style={[styles.cardBody, { color: `${theme.text}aa` }]}>
            Pick a path below to start adding toys or browse the current rankings.
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={onViewToys}>
              <Text style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
                View Toys
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: theme.tint,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={onSeeRankings}>
              <Text style={[styles.secondaryButtonText, { color: theme.tint }]}>See Rankings</Text>
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
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 16,
  },
  heroImage: {
    width: 140,
    height: 140,
  },
  kicker: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  cardBody: {
    fontSize: 15,
  },
  actions: {
    marginTop: 12,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
