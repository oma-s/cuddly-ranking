import { Alert } from "react-native";

export const confirmAction = (
  title: string,
  message: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
      {
        text: "Ja, löschen",
        style: "destructive",
        onPress: () => resolve(true),
      },
    ]);
  });
};
