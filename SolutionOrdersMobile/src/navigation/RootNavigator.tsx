import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ItemsScreen } from '../screens/ItemsScreen';
import { ItemFormScreen } from '../screens/ItemFormScreen';
import { RailTractionFormScreen } from '../screens/RailTractionFormScreen';
import { RailSleepersFormScreen } from '../screens/RailSleepersFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerLargeTitle: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#000' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Skup Złomu Trakcji i Podkładów Kolejowych' }}
        />
        <Stack.Screen
          name="Items"
          component={ItemsScreen}
          options={{ title: 'Złom (Items)' }}
        />
        <Stack.Screen
          name="CreateItem"
          component={ItemFormScreen}
          options={{ title: 'Dodaj złom' }}
        />
        <Stack.Screen
          name="EditItem"
          component={ItemFormScreen}
          options={{ title: 'Edytuj złom' }}
        />
        <Stack.Screen
          name="RailTraction"
          component={RailTractionFormScreen}
          options={{ title: 'Dodaj trakcję kolejową' }}
        />
        <Stack.Screen
          name="RailSleepers"
          component={RailSleepersFormScreen}
          options={{ title: 'Dodaj podkłady kolejowe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

