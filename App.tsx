import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, AppointmentProvider } from './src/context/AppContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppointmentProvider>
          <Navigation />
          <StatusBar style="light" />
        </AppointmentProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
