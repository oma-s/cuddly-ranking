/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const sprayPink = '#ff3c7d';
const neonLime = '#c4ff49';
const electricBlue = '#41d1ff';
const grapePurple = '#7a5bff';
const heroPurple = '#6d4dff';
const lilacGlow = '#d4c5ff';
const crownGold = '#f7ba3c';
const crownGoldDeep = '#d9981f';
const charcoal = '#0d0b16';
const asphalt = '#19162b';
const fog = '#f5f4fb';
const smoke = '#2c2943';

export const Colors = {
  light: {
    text: '#12081f',
    background: fog,
    card: '#ffffff',
    tint: heroPurple,
    icon: smoke,
    tabIconDefault: '#8f8aa8',
    tabIconSelected: heroPurple,
    border: '#e3dfff',
    sprayPink,
    neonLime,
    electricBlue,
    grapePurple,
    heroPurple,
    lilacGlow,
    crownGold,
    charcoal,
    asphalt,
  },
  dark: {
    text: '#fbf7ff',
    background: charcoal,
    card: asphalt,
    tint: lilacGlow,
    icon: '#d3cfff',
    tabIconDefault: '#7a76a3',
    tabIconSelected: lilacGlow,
    border: '#3c385a',
    sprayPink,
    neonLime,
    electricBlue,
    grapePurple,
    heroPurple,
    lilacGlow,
    crownGold,
    charcoal,
    asphalt,
  },
} as const;

export const StatColors = {
  strength: sprayPink,
  speed: electricBlue,
  smartness: grapePurple,
  all: crownGold,
};

export const StatGradients: Record<string, string[]> = {
  strength: ['#ff97c7', sprayPink],
  speed: ['#63f5ff', electricBlue],
  smartness: ['#b797ff', grapePurple],
  all: ['#ffe18a', crownGold],
};

export const AccentGradients = {
  primary: ['#ff8fd8', heroPurple],
  gold: ['#ffe594', crownGoldDeep],
};

export const GraffitiGradients = {
  hero: ['#12071e', '#261745', '#3f0f3f'],
  card: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.62)'],
  cardDark: ['rgba(32,28,52,0.9)', 'rgba(19,15,34,0.9)'],
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
