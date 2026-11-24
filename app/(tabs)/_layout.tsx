import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router/js-tabs";
import React from "react";
import { Platform } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const theme = Colors[useColorScheme() ?? "light"];

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          if (Platform.OS === "ios") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={typeof color === "string" ? color : theme.tabIconDefault} />
          ),
        }}
      />
      <Tabs.Screen
        name="toys"
        options={{
          title: "Crew",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="pawprint.fill" color={typeof color === "string" ? color : theme.tabIconDefault} />
          ),
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: "Rankings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="trophy.fill" color={typeof color === "string" ? color : theme.tabIconDefault} />
          ),
        }}
      />
    </Tabs>
  );
}
