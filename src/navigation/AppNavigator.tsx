// ============================================================
// NAVIGATION: AppNavigator — src/navigation/AppNavigator.tsx
// ============================================================
// Tab Navigator para las pantallas protegidas del área autenticada.
// Incluye HomeStack, Ejercicio 01 (JWT), Ejercicio 02 (OAuth PKCE),
// Favoritos, Perfil y Ajustes.
// ============================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { EditScreen } from '../screens/EditScreen';
import { Ejercicio01Screen } from '../screens/Ejercicio01Screen';
import { Ejercicio02Screen } from '../screens/Ejercicio02Screen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AppTabParamList, HomeStackParamList } from './types';
import { COLORS } from '../theme';
import { useSavedStore } from '../stores/savedStore';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="HomeList"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params?.name ?? 'Detalle del Equipo',
          headerBackTitle: 'Atrás',
        })}
      />
      <Stack.Screen
        name="CreateEquipment"
        component={CreateScreen}
        options={{
          title: 'Registrar Nuevo Equipo',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="EditEquipment"
        component={EditScreen}
        options={{
          title: 'Editar Equipo',
          headerBackTitle: 'Atrás',
        }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  const savedCount = useSavedStore((state) => state.savedItems.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'disc' : 'disc-outline';
          } else if (route.name === 'Ejercicio01Tab') {
            iconName = focused ? 'key' : 'key-outline';
          } else if (route.name === 'Ejercicio02Tab') {
            iconName = focused ? 'logo-github' : 'logo-github';
          } else if (route.name === 'FavoritesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Ejercicio01Tab"
        component={Ejercicio01Screen}
        options={{ title: 'Ejer-01' }}
      />
      <Tab.Screen
        name="Ejercicio02Tab"
        component={Ejercicio02Screen}
        options={{ title: 'Ejer-02' }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          title: 'Favoritos',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.textInverse,
            fontSize: 10,
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}
