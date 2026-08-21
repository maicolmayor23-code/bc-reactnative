// ============================================================
// NAVIGATION TYPES — src/navigation/types.ts
// ============================================================
// Definición estricta de rutas y parámetros para React Navigation 7.
// Dominio: DJ / Sonido e Iluminación.
// ============================================================

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

/**
 * Parámetros del Stack Navigator (anidado en la pestaña Home).
 */
export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: { id: string; name: string };
};

/**
 * Parámetros del Tab Navigator raíz.
 */
export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: undefined;
};

/**
 * Props para la pantalla HomeList.
 */
export type HomeListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeList'>,
  BottomTabScreenProps<RootTabParamList>
>;

/**
 * Props para la pantalla HomeDetail.
 */
export type HomeDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeDetail'>;

/**
 * Props para la pantalla FavoritesTab.
 */
export type FavoritesScreenProps = BottomTabScreenProps<RootTabParamList, 'FavoritesTab'>;
