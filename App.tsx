// ============================================================
// APP ENTRY POINT — App.tsx
// ============================================================
// Punto de entrada principal que configura QueryClientProvider de TanStack Query v5
// envolviendo la navegación de la aplicación en la raíz.
// ============================================================

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

// Creación de una instancia única de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Datos considerados "frescos" por 5 minutos
      retry: 2,                 // Reintentar 2 veces ante fallos de red
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
