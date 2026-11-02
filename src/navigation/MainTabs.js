import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Empty = () => null;

const icon = (active, inactive) => ({ color, focused }) =>
  <Ionicons name={focused ? active : inactive} size={22} color={color} />;

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('home', 'home-outline') }} />
      <Tab.Screen
        name="Add"
        component={Empty}
        options={{ tabBarIcon: icon('add-circle', 'add-circle-outline') }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); 
            navigation.navigate('AddEvent');
          },
        })}
      />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: icon('search', 'search-outline') }} />
    </Tab.Navigator>
  );
}
