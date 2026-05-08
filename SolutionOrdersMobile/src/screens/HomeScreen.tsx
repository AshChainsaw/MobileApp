import React, { useMemo } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Tile = {
  key: keyof RootStackParamList;
  title: string;
  color: string;
};

export function HomeScreen({ navigation }: Props) {
  const tilesSmall = useMemo<Tile[]>(
    () => [
      { key: 'RailTraction', title: 'Trakcje kolejowa', color: '#FFB900' },
      { key: 'RailSleepers', title: 'Podkłady kolejowe', color: '#7FBA00' },
      { key: 'Categories', title: 'Kategorie', color: '#7FBA00' },
      { key: 'Units', title: 'Jednostki', color: '#F25022' },
      { key: 'Clients', title: 'Klienci', color: '#FFB900' },
      { key: 'Workers', title: 'Pracownicy', color: '#B146C2' },
      { key: 'Orders', title: 'Zamówienia', color: '#288351' },
    ],
    [],
  );

  const onTilePress = (key: keyof RootStackParamList) => {
    if (key === 'Items') return navigation.navigate('Items');
    if (key === 'RailTraction') return navigation.navigate('RailTraction');
    if (key === 'RailSleepers') return navigation.navigate('RailSleepers');
    Alert.alert('Wkrótce', 'Ten moduł jeszcze nie ma widoków.');
  };

  return (
    <View style={styles.root}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    

      {/* DUŻY kafelek na całą szerokość */}
      <Pressable
        onPress={() => onTilePress('Items')}
        style={({ pressed }) => [
          styles.tile,
          styles.tileWide,
          { backgroundColor: '#00A4EF', opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.tileTitle}>Złom</Text>
      </Pressable>

      {/* MAŁE kafelki: 2 w rzędzie */}
      <FlatList
        data={tilesSmall}
        keyExtractor={(t) => String(t.key)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onTilePress(item.key)}
            style={({ pressed }) => [
              styles.tile,
              styles.tileSmall,
              { backgroundColor: item.color, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.tileTitle}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  logo: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  h1: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 12 },

  grid: { paddingBottom: 18 },
  row: { gap: 12 },

  tile: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  tileWide: { width: '100%', height: 110 },
  tileSmall: { flex: 1, height: 110 },

  tileTitle: { color: '#0B0F19', fontSize: 20, fontWeight: '800' },
});