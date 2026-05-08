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

export function RailTractionFormScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState('AC');
  const [voltageKv, setVoltageKv] = useState('3');
  const [notes, setNotes] = useState('');

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>Trakcja kolejowa</Text>
        <Text style={styles.sub}>Widok tymczasowy (bez API)</Text>

        <Field label="Nazwa / odcinek *">
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="np. Linia 131 – odc. A"
            placeholderTextColor="#6E7687"
          />
        </Field>

        <View style={styles.row}>
          <View style={styles.col}>
            <Field label="Typ (AC/DC)">
              <TextInput
                value={type}
                onChangeText={setType}
                style={styles.input}
                placeholder="AC"
                placeholderTextColor="#6E7687"
                autoCapitalize="characters"
              />
            </Field>
          </View>
          <View style={styles.col}>
            <Field label="Napięcie (kV)">
              <TextInput
                value={voltageKv}
                onChangeText={setVoltageKv}
                style={styles.input}
                placeholder="3"
                placeholderTextColor="#6E7687"
                keyboardType="decimal-pad"
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
            Alert.alert('Zapisano (offline)', `Nazwa: ${name}\nTyp: ${type}\nNapięcie: ${voltageKv} kV`);
            setName('');
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
    backgroundColor: '#FFB900',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveDisabled: { backgroundColor: '#22304A' },
  saveText: { color: '#0B0F19', fontSize: 16, fontWeight: '800' },
});

