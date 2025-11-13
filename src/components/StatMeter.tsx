import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, StatColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RankingCategory, ToyStatKey } from '@/src/types/toy';

type StatMeterProps = {
  label?: string;
  value: number;
  statKey?: RankingCategory | ToyStatKey;
  size?: 'sm' | 'md';
};

const SEGMENTS = Array.from({ length: 10 }, (_, index) => index);

export const StatMeter = memo(({ label, value, statKey = 'strength', size = 'md' }: StatMeterProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const color = StatColors[statKey] ?? theme.tint;
  const clamped = Math.max(0, Math.min(10, Math.round(value)));
  const isSmall = size === 'sm';

  const meter = useMemo(
    () =>
      SEGMENTS.map((segment) => {
        const filled = segment < clamped;
        return (
          <View
            key={segment}
            style={[
              styles.segment,
              {
                backgroundColor: filled ? color : 'rgba(255,255,255,0.12)',
                opacity: filled ? 1 : 0.35,
                height: isSmall ? 6 : 8,
              },
            ]}
          />
        );
      }),
    [clamped, color, isSmall],
  );

  return (
    <View style={styles.container}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
          <Text style={[styles.value, { color }]}>{clamped}</Text>
        </View>
      ) : null}
      <View style={[styles.meter, { backgroundColor: `${color}14`, padding: isSmall ? 3 : 4 }]}>
        {meter}
      </View>
    </View>
  );
});
StatMeter.displayName = 'StatMeter';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
  },
  meter: {
    flexDirection: 'row',
    gap: 4,
    borderRadius: 999,
  },
  segment: {
    flex: 1,
    borderRadius: 4,
  },
});
