// ============================================================
// NAVIGATION: RootNavigator
// ============================================================
// Configuración de React Navigation 7 con Tab Navigator + Stack Navigator anidado.
// Dominio: DJ / Sonido e Iluminación (Beat & Light Pro).
// Incluye pantallas: HomeList, HomeDetail, CreateEquipment, EditEquipment y FavoritesTab.
// ============================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { EditScreen } from '../screens/EditScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeStackParamList, RootTabParamList } from './types';
import { COLORS } from '../theme';
import { useSavedStore } from '../stores/savedStore';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Stack Navigator anidado para la pestaña "Home".
 * Permite navegar desde la lista (HomeList) hacia la pantalla de detalle (HomeDetail),
 * la pantalla de creación (CreateEquipment) y la pantalla de edición (EditEquipment).
 */
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

/**
 * Tab Navigator Raíz con dos pestañas: Inicio y Favoritos.
 * Badge dinámico en la pestaña Favoritos sincronizado con Zustand (UI State).
 */
export function RootNavigator(): React.JSX.Element {
  const savedCount = useSavedStore((state) => state.savedItems.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'disc' : 'disc-outline';
          } else {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#61DAFB',
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
          fontSize: 12,
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
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          title: 'Favoritos',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.textInverse,
            fontSize: 11,
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
}
