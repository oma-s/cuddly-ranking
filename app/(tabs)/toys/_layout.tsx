import { Stack } from "expo-router";

export default function ToysStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerTitleAlign: "left",
        headerTransparent: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Crew" }} />
      <Stack.Screen
        name="form"
        options={{
          title: "Toy Form",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Toy Detail",
        }}
      />
    </Stack>
  );
}
