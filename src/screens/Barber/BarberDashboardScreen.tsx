import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useAppointments } from '../../context/AppContext';

export default function BarberDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const { getBarberAppointments } = useAppointments();

  if (!user) return null;

  const appointments = getBarberAppointments(user.barberId || '1');
  
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const confirmedCount = appointments.filter(apt => apt.status === 'confirmed').length;
  const pendingCount = appointments.filter(apt => apt.status === 'pending').length;
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;

  const totalRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.price, 0);

  const StatCard = ({ icon, title, value, color, onPress }: any) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const renderTodayAppointment = (apt: any) => (
    <View key={apt.id} style={styles.appointmentItem}>
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>{apt.time}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.clientName}>{apt.clientName}</Text>
        <Text style={styles.serviceName}>{apt.serviceName}</Text>
        <Text style={styles.appointmentPrice}>${apt.price}</Text>
      </View>
      <View style={[styles.statusDot, { 
        backgroundColor: apt.status === 'confirmed' ? '#27ae60' : '#f39c12' 
      }]} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.name}! 👋</Text>
          <Text style={styles.subtitle}>Panel de Control</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard
            icon="calendar"
            title="Citas Hoy"
            value={todayAppointments.length}
            color="#3498db"
            onPress={() => navigation.navigate('BarberAppointments')}
          />
          <StatCard
            icon="checkmark-circle"
            title="Confirmadas"
            value={confirmedCount}
            color="#27ae60"
            onPress={() => navigation.navigate('BarberAppointments')}
          />
          <StatCard
            icon="time"
            title="Pendientes"
            value={pendingCount}
            color="#f39c12"
            onPress={() => navigation.navigate('BarberAppointments')}
          />
          <StatCard
            icon="trophy"
            title="Completadas"
            value={completedCount}
            color="#9b59b6"
            onPress={() => navigation.navigate('BarberAppointments')}
          />
        </View>

        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Ionicons name="cash" size={24} color="#27ae60" />
            <Text style={styles.revenueTitle}>Ingresos Totales</Text>
          </View>
          <Text style={styles.revenueAmount}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.revenueSubtext}>De servicios completados</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Citas de Hoy</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BarberAppointments')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {todayAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={50} color="#bdc3c7" />
              <Text style={styles.emptyText}>No tienes citas para hoy</Text>
            </View>
          ) : (
            <View style={styles.todayList}>
              {todayAppointments.map(renderTodayAppointment)}
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('BarberAppointments')}
          >
            <Ionicons name="list" size={24} color="#3498db" />
            <Text style={styles.actionCardText}>Ver todas las citas</Text>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar" size={24} color="#9b59b6" />
            <Text style={styles.actionCardText}>Mi horario</Text>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('BarberStatistics')}
          >
            <Ionicons name="stats-chart" size={24} color="#27ae60" />
            <Text style={styles.actionCardText}>Estadísticas</Text>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </TouchableOpacity>
        </View>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 10,
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  revenueSubtext: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  todayList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  appointmentTime: {
    width: 60,
    marginRight: 15,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  appointmentDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  serviceName: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  appointmentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 14,
    color: '#7f8c8d',
  },
  quickActions: {
    marginBottom: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});
