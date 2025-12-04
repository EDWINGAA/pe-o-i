import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useAppointments } from '../../context/AppContext';

export default function MyAppointmentsScreen() {
  const { user } = useAuth();
  const { getUserAppointments } = useAppointments();

  const appointments = getUserAppointments(user!.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'completed':
        return '#3498db';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const renderAppointment = ({ item }: any) => (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.barbershopName}>{item.barbershopName}</Text>
          <Text style={styles.barberName}>con {item.barberName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="cut-outline" size={18} color="#7f8c8d" />
          <Text style={styles.infoText}>{item.serviceName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#7f8c8d" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#7f8c8d" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={18} color="#7f8c8d" />
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>
          {appointments.length} cita{appointments.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#bdc3c7" />
          <Text style={styles.emptyText}>No tienes citas agendadas</Text>
          <Text style={styles.emptySubtext}>
            Explora barberías y agenda tu próxima cita
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  listContent: {
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  barbershopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  barberName: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginBottom: 15,
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  priceText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
