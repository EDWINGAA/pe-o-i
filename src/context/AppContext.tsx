import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Appointment } from '../types';
import { mockUsers, allAppointments } from '../data/mockData';
import { lightTheme, darkTheme, ThemeType } from '../theme/colors';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string, phone: string) => boolean;
  isAuthenticated: boolean;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  getUserAppointments: (userId: string) => Appointment[];
  getBarberAppointments: (barberId: string) => Appointment[];
}

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeType;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (email: string, password: string, name: string, phone: string): boolean => {
    // Verificar si el email ya existe
    if (users.some(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      phone,
      role: 'client'
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Provider de citas
export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(allAppointments);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(
      appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      )
    );
  };

  const getUserAppointments = (userId: string): Appointment[] => {
    return appointments.filter(apt => apt.clientId === userId);
  };

  const getBarberAppointments = (barberId: string): Appointment[] => {
    return appointments.filter(apt => apt.barberId === barberId);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointmentStatus,
        getUserAppointments,
        getBarberAppointments
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

// Hooks personalizados
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments debe usarse dentro de AppointmentProvider');
  }
  return context;
};

// Provider de tema
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
