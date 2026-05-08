import React, { useCallback, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { CreateItemRequest, Item, UpdateItemRequest } from '../types/models';
import api from '../api/apiService';

type Props =
  | NativeStackScreenProps<RootStackParamList, 'CreateItem'>
  | NativeStackScreenProps<RootStackParamList, 'EditItem'>;

function toNumberOrNull(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function ItemFormScreen({ navigation, route }: Props) {
  const editing = route.name === 'EditItem';
  const item = (editing ? (route.params as any).item : null) as Item | null;

  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [code, setCode] = useState(item?.code ?? '');
  const [idCategory, setIdCategory] = useState(String(item?.idCategory ?? 1));
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : '');
  const [quantity, setQuantity] = useState(item?.quantity != null ? String(item.quantity) : '');
  const [idUnitOfMeasurement, setIdUnitOfMeasurement] = useState(
    item?.idUnitOfMeasurement != null ? String(item.idUnitOfMeasurement) : '',
  );
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    return name.trim().length > 0 && toNumberOrNull(idCategory) != null;
  }, [name, idCategory]);

  const onSave = useCallback(async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const base: CreateItemRequest = {
        name: name.trim(),
        description: description.trim() ? description.trim() : undefined,
        idCategory: toNumberOrNull(idCategory) ?? 1,
        price: toNumberOrNull(price) ?? undefined,
        quantity: toNumberOrNull(quantity) ?? undefined,
        idUnitOfMeasurement: toNumberOrNull(idUnitOfMeasurement) ?? undefined,
        code: code.trim() ? code.trim() : undefined,
      };

      if (!editing) {
        await api.createItem(base);
      } else {
        const payload: UpdateItemRequest = {
          ...base,
          idItem: item!.idItem,
          isActive,
        };
        await api.updateItem(item!.idItem, payload);
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Błąd', e?.message ?? 'Nie udało się zapisać.');
    } finally {
      setSaving(false);
    }
  }, [
    canSave,
    saving,
    name,
    description,
    idCategory,
    price,
    quantity,
    idUnitOfMeasurement,
    code,
    editing,
    item,
    isActive,
    navigation,
  ]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>{editing ? 'Edytuj złom' : 'Dodaj złom'}</Text>
        <Text style={styles.sub}>Wymagane: nazwa + IdCategory</Text>

        <Field label="Nazwa *">
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="np. Aluminium" placeholderTextColor="#6E7687" />
        </Field>

        <Field label="Opis">
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textarea]}
            placeholder="opcjonalnie"
            placeholderTextColor="#6E7687"
            multiline
          />
        </Field>

        <View style={styles.row}>
          <View style={styles.col}>
            <Field label="Kod">
              <TextInput value={code} onChangeText={setCode} style={styles.input} placeholder="np. ZLOM-001" placeholderTextColor="#6E7687" />
            </Field>
          </View>
          <View style={styles.col}>
            <Field label="IdCategory *">
              <TextInput
                value={idCategory}
                onChangeText={setIdCategory}
                style={styles.input}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor="#6E7687"
              />
            </Field>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Field label="Cena">
              <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="np. 12.50"
                placeholderTextColor="#6E7687"
              />
            </Field>
          </View>
          <View style={styles.col}>
            <Field label="Ilość">
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="np. 3"
                placeholderTextColor="#6E7687"
              />
            </Field>
          </View>
        </View>

        <Field label="IdUnitOfMeasurement">
          <TextInput
            value={idUnitOfMeasurement}
            onChangeText={setIdUnitOfMeasurement}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="opcjonalnie"
            placeholderTextColor="#6E7687"
          />
        </Field>

        {editing ? (
          <Pressable
            onPress={() => setIsActive((v) => !v)}
            style={({ pressed }) => [styles.toggle, { opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={[styles.dot, isActive ? styles.dotOn : styles.dotOff]} />
            <Text style={styles.toggleText}>Aktywny: {isActive ? 'TAK' : 'NIE'}</Text>
          </Pressable>
        ) : null}

        <Pressable
          disabled={!canSave || saving}
          onPress={onSave}
          style={({ pressed }) => [
            styles.save,
            (!canSave || saving) && styles.saveDisabled,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.saveText}>{saving ? 'Zapisywanie…' : 'Zapisz'}</Text>
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
    backgroundColor: '#00A4EF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveDisabled: { backgroundColor: '#22304A' },
  saveText: { color: '#0B0F19', fontSize: 16, fontWeight: '800' },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#22304A',
    marginTop: 6,
    marginBottom: 4,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotOn: { backgroundColor: '#22C55E' },
  dotOff: { backgroundColor: '#EF4444' },
  toggleText: { color: '#fff', fontWeight: '700' },
});

