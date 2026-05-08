import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export function RailSleepersFormScreen() {
  const [material, setMaterial] = useState('beton');
  const [count, setCount] = useState('100');
  const [lengthM, setLengthM] = useState('2.6');
  const [notes, setNotes] = useState('');

  const canSave = useMemo(() => {
    const c = Number(count);
    return Number.isFinite(c) && c > 0;
  }, [count]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>Podkłady kolejowe</Text>
        <Text style={styles.sub}>Widok tymczasowy (bez API)</Text>

        <Field label="Materiał">
          <TextInput
            value={material}
            onChangeText={setMaterial}
            style={styles.input}
            placeholder="np. beton / drewno"
            placeholderTextColor="#6E7687"
          />
        </Field>

        <View style={styles.row}>
          <View style={styles.col}>
            <Field label="Ilość sztuk *">
              <TextInput
                value={count}
                onChangeText={setCount}
                style={styles.input}
                keyboardType="number-pad"
                placeholder="100"
                placeholderTextColor="#6E7687"
              />
            </Field>
          </View>
          <View style={styles.col}>
            <Field label="Długość (m)">
              <TextInput
                value={lengthM}
                onChangeText={setLengthM}
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="2.6"
                placeholderTextColor="#6E7687"
              />
            </Field>
          </View>
        </View>

        <Field label="Uwagi">
          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.textarea]}
            placeholder="opcjonalnie"
            placeholderTextColor="#6E7687"
            multiline
          />
        </Field>

        <Pressable
          disabled={!canSave}
          onPress={() => {
            Alert.alert(
              'Zapisano (offline)',
              `Materiał: ${material}\nIlość: ${count}\nDługość: ${lengthM} m`,
            );
            setNotes('');
          }}
          style={({ pressed }) => [
            styles.save,
            !canSave && styles.saveDisabled,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.saveText}>Zapisz</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F19' },
  content: { padding: 16, paddingBottom: 40 },
  h1: { color: '#fff', fontSize: 24, fontWeight: '800' },
  sub: { color: '#A7B0C0', marginTop: 6, marginBottom: 14 },
  field: { marginBottom: 12 },
  label: { color: '#C7D0E0', marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#22304A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
  },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  save: {
    marginTop: 10,
    backgroundColor: '#7FBA00',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveDisabled: { backgroundColor: '#22304A' },
  saveText: { color: '#0B0F19', fontSize: 16, fontWeight: '800' },
});

