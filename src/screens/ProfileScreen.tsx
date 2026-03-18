import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AppContext';
import { useTheme } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, color = theme.text }: any) => (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.divider, backgroundColor: theme.surface }]} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.disabled} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.surface }]}>
          <Ionicons name="person" size={50} color={theme.primary} />
        </View>
        <Text style={[styles.name, { color: theme.headerText }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: theme.headerText }]}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: theme.surface }]}>
          <Text style={[styles.roleText, { color: theme.text }]}>
            {user?.role === 'client' ? '👤 Cliente' : '✂️ Barbero'}
          </Text>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Cuenta</Text>
          <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
            <MenuItem
              icon="person-outline"
              title="Editar Perfil"
              onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notificaciones"
              onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
            />
            <MenuItem
              icon="lock-closed-outline"
              title="Cambiar Contraseña"
              onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
            />
          </View>
        </View>

        {user?.role === 'client' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferencias</Text>
            <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
              <MenuItem
                icon="heart-outline"
                title="Mis Favoritos"
                onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
              />
              <MenuItem
                icon="card-outline"
                title="Métodos de Pago"
                onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
              />
              <MenuItem
                icon="location-outline"
                title="Direcciones"
                onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Apariencia</Text>
          <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
            <View style={[styles.menuItem, { borderBottomColor: theme.divider, justifyContent: 'space-between' }]}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={theme.primary} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>
                  {isDark ? 'Tema Oscuro' : 'Tema Claro'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Soporte</Text>
          <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
            <MenuItem
              icon="help-circle-outline"
              title="Centro de Ayuda"
              onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
            />
            <MenuItem
              icon="document-text-outline"
              title="Términos y Condiciones"
              onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Política de Privacidad"
              onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
            <MenuItem
              icon="log-out-outline"
              title="Cerrar Sesión"
              onPress={handleLogout}
              color={theme.danger}
            />
          </View>
        </View>

        <Text style={[styles.versionText, { color: theme.textSecondary }]}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#ecf0f1',
    marginBottom: 15,
  },
  roleBadge: {
    backgroundColor: '#34495e',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 30,
  },
});
