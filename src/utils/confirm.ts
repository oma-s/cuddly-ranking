import { Alert } from 'react-native';

export const confirmAction = (title: string, message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Yes, do it', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
};
