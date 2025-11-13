import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AnimatedSplashProps = {
  onFinish?: () => void;
};

export const AnimatedSplash = ({ onFinish }: AnimatedSplashProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const scale = useRef(new Animated.Value(0.8)).current;
  const glowScale = useRef(new Animated.Value(0.4)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  const hasFinished = useRef(false);
  const finishOnce = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    onFinish?.();
  }, [onFinish]);

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(glowScale, {
        toValue: 5,
        duration: 1600,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: 400,
        delay: 1250,
        useNativeDriver: true,
      }),
    ]).start(finishOnce);

    const timeout = setTimeout(finishOnce, 2200);
    return () => clearTimeout(timeout);
  }, [fade, finishOnce, glowScale, rotate, scale]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#06030f", "#12081f"]
            : ["#f1e4ff", "#d3c6ff"]
        }
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor:
              colorScheme === "dark" ? "rgba(98,74,255,0.35)" : "rgba(109,77,255,0.45)",
            transform: [
              { scale: glowScale },
              {
                rotate: rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [{ scale }],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/logo_transparent.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={[styles.title, { color: theme.text }]}>Cuddly Crew</Text>
        <Text style={[styles.subtitle, { color: `${theme.text}cc` }]}>
          Street-ready cuddle managers
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  glow: {
    width: 220,
    height: 220,
    borderRadius: 110,
    position: "absolute",
    alignSelf: "center",
    top: "35%",
  },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    letterSpacing: 1,
  },
});
