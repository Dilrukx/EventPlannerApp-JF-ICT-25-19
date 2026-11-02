import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EventsProvider } from './src/context/EventsContext';
import { setupNotifications } from './src/utils/notifications';
import { colors } from './src/theme';
import SplashScreen from './src/screens/SplashScreen';
import MainTabs from './src/navigation/MainTabs';
import AddEditEventScreen from './src/screens/AddEditEventScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary },
};

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <EventsProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AddEvent" component={AddEditEventScreen} />
            <Stack.Screen name="EditEvent" component={AddEditEventScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </EventsProvider>
    </SafeAreaProvider>
  );
}

