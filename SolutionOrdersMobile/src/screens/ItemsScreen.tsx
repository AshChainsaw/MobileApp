import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { Item } from '../types/models';
import api from '../api/apiService';

type Props = NativeStackScreenProps<RootStackParamList, 'Items'>;

export function ItemsScreen({ navigation }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getItems();
      setItems(data ?? []);
    } catch (e: any) {
      Alert.alert('Błąd API', e?.message ?? 'Nie udało się pobrać items.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((it) => {
      const name = (it.name ?? '').toLowerCase();
      const code = (it.code ?? '').toLowerCase();
      const cat = (it.categoryName ?? '').toLowerCase();
      return name.includes(query) || code.includes(query) || cat.includes(query);
    });
  }, [items, q]);

  const onDelete = useCallback(
    (item: Item) => {
      Alert.alert('Usuń', `Usunąć "${item.name ?? 'bez nazwy'}"?`, [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteItem(item.idItem);
              await load();
            } catch (e: any) {
              Alert.alert('Błąd', e?.message ?? 'Nie udało się usunąć.');
            }
          },
        },
      ]);
    },
    [load],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.centerText}>Ładowanie…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Szukaj po nazwie / kodzie / kategorii…"
        placeholderTextColor="#6E7687"
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(it) => String(it.idItem)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load();
            }}
            tintColor="#fff"
          />
        }
        renderItem={({ item, index }) => {
          const color = TILE_COLORS[index % TILE_COLORS.length];
          return (
            <Pressable
              onPress={() => navigation.navigate('EditItem', { item })}
              onLongPress={() => onDelete(item)}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: color, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.tileTitle} numberOfLines={2}>
                {item.name ?? 'Bez nazwy'}
              </Text>
              <Text style={styles.tileMeta} numberOfLines={1}>
                Kod: {item.code ?? '-'}
              </Text>
              <Text style={styles.tileMeta} numberOfLines={1}>
                Kat: {item.categoryName ?? item.idCategory}
              </Text>
              <Text style={styles.tileMeta} numberOfLines={1}>
                Ilość: {item.quantity ?? '-'} {item.unitName ?? ''}
              </Text>
            </Pressable>
          );
        }}
      />

      <Pressable
        onPress={() => navigation.navigate('CreateItem')}
        style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const TILE_COLORS = ['#00A4EF', '#7FBA00', '#F25022', '#FFB900', '#B146C2', '#0099BC'];

const styles = StyleSheet.create({
  root: { flex: 1, padding: 12 },
  search: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#22304A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
  },
  grid: { paddingBottom: 90 },
  row: { gap: 12 },
  tile: {
    flex: 1,
    minHeight: 128,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'flex-end',
  },
  tileTitle: { color: '#0B0F19', fontSize: 16, fontWeight: '800' },
  tileMeta: { color: '#0B0F19', marginTop: 4, opacity: 0.9 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: { fontSize: 30, fontWeight: '800', color: '#0B0F19', marginTop: -2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerText: { marginTop: 10, color: '#A7B0C0' },
});

