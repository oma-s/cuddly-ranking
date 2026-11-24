import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AccentGradients, Colors, StatColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatMeter } from "@/src/components/StatMeter";
import { ToyDataStatus } from "@/src/components/ToyDataStatus";
import { useToyById, useToysContext } from "@/src/context/ToysContext";
import { resolveToyPhotoUri } from "@/src/storage/toyPhotos";
import { emptyToyDraft, TOY_STATS, type Toy, type ToyDraft, type ToyStatKey } from "@/src/types/toy";

const numberOptions = Array.from({ length: 10 }, (_, idx) => idx + 1);

export default function ToyFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { loadStatus, reload } = useToysContext();
  const editingToy = useToyById(typeof id === "string" ? id : undefined);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: id === undefined ? "Neu" : "Bearbeiten" });
  }, [id, navigation]);

  if (loadStatus !== "ready") return <ToyDataStatus status={loadStatus} onRetry={reload} />;
  if (id !== undefined && !editingToy) return <ToyDataStatus status="missing" />;

  return <ToyEditor key={editingToy?.id ?? "new"} editingToy={editingToy} />;
}

function ToyEditor({ editingToy }: { editingToy?: Toy }) {
  const { saveToy } = useToysContext();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const primaryButtonTextColor = colorScheme === "dark" ? "#0b0612" : "#fff";

  const [draft, setDraft] = useState<ToyDraft>(() => editingToy ?? emptyToyDraft());
  const [saving, setSaving] = useState(false);
  const saveInProgress = useRef(false);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const photoUri = resolveToyPhotoUri(draft.photoUri);

  const handleStatChange = (key: ToyStatKey, value: number) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoto = async () => {
    setPhotoError("");
    try {
      if (Platform.OS !== "web") {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) {
          setPhotoError("Aktiviere den Kamerazugriff, um ein Foto zu machen.");
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.6,
        allowsEditing: true,
        aspect: [1, 1],
      });
      const uri = result.assets?.[0]?.uri;
      if (uri) setDraft((prev) => ({ ...prev, photoUri: uri }));
    } catch (error) {
      console.warn("Could not take toy photo", error);
      setPhotoError("Das Foto konnte nicht aufgenommen werden.");
    }
  };

  const handleSave = async () => {
    if (saveInProgress.current) return;
    if (!draft.name.trim()) {
      setError("Gib deinem Crewmitglied einen Namen.");
      return;
    }

    saveInProgress.current = true;
    setError("");
    setSaving(true);
    let toy: Toy;
    try {
      toy = await saveToy(draft, editingToy?.id);
    } catch (error) {
      console.warn("Could not save toy", error);
      setError("Das Crewmitglied konnte nicht gespeichert werden. Versuch es erneut.");
      saveInProgress.current = false;
      setSaving(false);
      return;
    }

    const detail = { pathname: "/(tabs)/toys/[id]", params: { id: toy.id } } as const;
    if (editingToy) router.dismissTo(detail);
    else router.replace(detail);
  };

  const renderNumberRow = (
    key: ToyStatKey,
    label: string,
    color: string
  ) => (
    <View key={key} style={styles.statBlock}>
      <Text style={[styles.statLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.numberRow}>
        {numberOptions.map((value) => {
          const isSelected = draft[key] === value;
          return (
            <Pressable
              key={`${key}-${value}`}
              onPress={() => handleStatChange(key, value)}
              style={[
                styles.numberChip,
                {
                  backgroundColor: isSelected ? color : "transparent",
                  borderColor: color,
                },
              ]}
            >
              <Text
                style={[
                  styles.numberText,
                  { color: isSelected ? "#0b0612" : color },
                ]}
              >
                {value}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <StatMeter value={draft[key]} statKey={key} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={({ pressed }) => [
            styles.photoButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          onPress={handlePhoto}
          disabled={saving}
        >
          {photoUri ? (
            <View style={styles.photoPreview}>
              <Image
                source={{ uri: photoUri }}
                style={styles.previewImage}
                contentFit="cover"
              />
            </View>
          ) : null}
          <Text style={[styles.photoText, { color: theme.text }]}>
            {photoUri ? "Foto erneut aufnehmen" : "Foto machen"}
          </Text>
        </Pressable>
        {photoError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{photoError}</Text> : null}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
          <TextInput
            value={draft.name}
            onChangeText={(text) =>
              setDraft((prev) => ({ ...prev, name: text }))
            }
            placeholder="z.B. Teddy Thunder"
            placeholderTextColor="#8c819e"
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
          />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>
            Beschreibung
          </Text>
          <TextInput
            value={draft.description}
            onChangeText={(text) =>
              setDraft((prev) => ({ ...prev, description: text }))
            }
            placeholder="Erzähle was dazu..."
            placeholderTextColor="#8c819e"
            multiline
            style={[
              styles.input,
              styles.multiline,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
          />
        </View>

        {TOY_STATS.map(({ key, label, emoji }) =>
          renderNumberRow(key, `${label} (1-10) ${emoji}`, StatColors[key])
        )}

        {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveButton,
            {
              opacity: saving || pressed ? 0.8 : 1,
            },
          ]}
        >
          <LinearGradient
            colors={AccentGradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Text style={[styles.saveText, { color: primaryButtonTextColor }]}>
              {saving ? "Speichern..." : "Speichern"}
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 20,
    paddingBottom: 160,
  },
  photoButton: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
    gap: 12,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  photoText: {
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  statBlock: {
    gap: 10,
  },
  statLabel: {
    fontWeight: "700",
  },
  numberRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  numberChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  numberText: {
    fontWeight: "800",
  },
  saveButton: {
    borderRadius: 18,
    marginTop: 12,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 18,
  },
  saveText: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "700",
  },
});
