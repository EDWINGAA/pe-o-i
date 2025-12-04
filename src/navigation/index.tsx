import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AppContext';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Client Screens
import HomeScreen from '../screens/Client/HomeScreen';
import BarbershopDetailScreen from '../screens/Client/BarbershopDetailScreen';
import BarberProfileScreen from '../screens/Client/BarberProfileScreen';
import BookAppointmentScreen from '../screens/Client/BookAppointmentScreen';
import MyAppointmentsScreen from '../screens/Client/MyAppointmentsScreen';

// Barber Screens
import BarberDashboardScreen from '../screens/Barber/BarberDashboardScreen';
import BarberAppointmentsScreen from '../screens/Barber/BarberAppointmentsScreen';

// Profile Screen (Shared)
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Client Tab Navigator
function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyAppointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: '#7f8c8d',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="MyAppointments" 
        component={MyAppointmentsScreen}
        options={{ tabBarLabel: 'Mis Citas' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Barber Tab Navigator
function BarberTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'BarberDashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'BarberAppointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: '#7f8c8d',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="BarberDashboard" 
        component={BarberDashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="BarberAppointments" 
        component={BarberAppointmentsScreen}
        options={{ tabBarLabel: 'Citas' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Main Navigation
export default function Navigation() {
  const { isAuthenticated, user } = useAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // Auth Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : user?.role === 'client' ? (
        // Client Stack
        <Stack.Navigator>
          <Stack.Screen 
            name="ClientTabs" 
            component={ClientTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="BarbershopDetail" 
            component={BarbershopDetailScreen}
            options={{ 
              title: 'Detalle',
              headerStyle: { backgroundColor: '#2c3e50' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="BarberProfile" 
            component={BarberProfileScreen}
            options={{ 
              title: 'Perfil del Barbero',
              headerStyle: { backgroundColor: '#2c3e50' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="BookAppointment" 
            component={BookAppointmentScreen}
            options={{ 
              title: 'Agendar Cita',
              headerStyle: { backgroundColor: '#2c3e50' },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      ) : (
        // Barber Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BarberTabs" component={BarberTabs} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
