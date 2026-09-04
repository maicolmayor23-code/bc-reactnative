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
 * Parámetros del Stack Navigator principal (anidado en HomeTab).
 */
export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: { id: string; name: string };
  CreateEquipment: undefined;
};

/**
 * Parámetros del Tab Navigator raíz.
 */
export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: undefined;
};

/**
 * Props para las pantallas del Stack Navigator.
 */
export type HomeListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type HomeDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeDetail'>;

export type CreateEquipmentScreenProps = NativeStackScreenProps<HomeStackParamList, 'CreateEquipment'>;

export type FavoritesScreenProps = BottomTabScreenProps<RootTabParamList, 'FavoritesTab'>;
