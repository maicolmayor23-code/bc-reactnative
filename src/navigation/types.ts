// ============================================================
// NAVIGATION TYPES — src/navigation/types.ts
// ============================================================
// Tipado estricto de rutas y parámetros para React Navigation 7.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

/**
 * Parámetros del Auth Stack Navigator (público).
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Parámetros del Home Stack Navigator (anidado en la pestaña Inicio).
 */
export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: { id: string; name: string };
  CreateEquipment: undefined;
  EditEquipment: { id: string };
};

/**
 * Parámetros del App Tab Navigator (protegido).
 */
export type AppTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Ejercicio01Tab: undefined;
  Ejercicio02Tab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

/**
 * Alias de compatibilidad RootTabParamList
 */
export type RootTabParamList = AppTabParamList;

/**
 * Props para las pantallas del Auth Stack.
 */
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

/**
 * Props para las pantallas del Home Stack.
 */
export type HomeListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeList'>,
  BottomTabScreenProps<AppTabParamList>
>;

export type HomeDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeDetail'>;
export type CreateEquipmentScreenProps = NativeStackScreenProps<HomeStackParamList, 'CreateEquipment'>;
export type EditEquipmentScreenProps = NativeStackScreenProps<HomeStackParamList, 'EditEquipment'>;
export type FavoritesScreenProps = BottomTabScreenProps<AppTabParamList, 'FavoritesTab'>;
export type ProfileScreenProps = BottomTabScreenProps<AppTabParamList, 'ProfileTab'>;
export type SettingsScreenProps = BottomTabScreenProps<AppTabParamList, 'SettingsTab'>;
