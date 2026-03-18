import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useAppointments, useTheme } from '../../context/AppContext';

export default function BarberAppointmentsScreen() {
  const { user } = useAuth();
  const { getBarberAppointments, updateAppointmentStatus } = useAppointments();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  if (!user) return null;

  const allAppointments = getBarberAppointments(user.barberId || '1');
  
  const filteredAppointments = filter === 'all' 
    ? allAppointments 
    : allAppointments.filter(apt => apt.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'completed':
        return theme.primary;
      case 'cancelled':
        return theme.danger;
      default:
        return theme.textSecondary;
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

  const filterOptions = [
    { key: 'all', label: 'Todas', icon: 'list' },
    { key: 'pending', label: 'Pendientes', icon: 'time' },
    { key: 'confirmed', label: 'Confirmadas', icon: 'checkmark-circle' },
    { key: 'completed', label: 'Completadas', icon: 'trophy' }
  ];

  const getFilterLabel = () => {
    return filterOptions.find(opt => opt.key === filter)?.label || 'Filtro';
  };

  const handleConfirm = (appointmentId: string) => {
    Alert.alert(
      'Confirmar cita',
      '¿Deseas confirmar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => updateAppointmentStatus(appointmentId, 'confirmed')
        }
      ]
    );
  };

  const handleComplete = (appointmentId: string) => {
    Alert.alert(
      'Completar cita',
      '¿Marcar esta cita como completada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Completar', 
          onPress: () => updateAppointmentStatus(appointmentId, 'completed')
        }
      ]
    );
  };

  const handleCancel = (appointmentId: string) => {
    Alert.alert(
      'Cancelar cita',
      '¿Seguro que deseas cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => updateAppointmentStatus(appointmentId, 'cancelled')
        }
      ]
    );
  };

  const renderAppointment = ({ item }: any) => (
    <View style={[styles.appointmentCard, { backgroundColor: theme.surface, shadowColor: theme.text }]}>
      <View style={styles.cardHeader}>
        <View style={styles.dateTimeContainer}>
          <View style={[styles.dateBox, { backgroundColor: theme.primary }]}>
            <Text style={[styles.dateDay, { color: theme.headerText }]}>{new Date(item.date).getDate()}</Text>
            <Text style={[styles.dateMonth, { color: theme.headerText }]}>
              {new Date(item.date).toLocaleDateString('es-MX', { month: 'short' })}
            </Text>
          </View>
          <View style={styles.timeBox}>
            <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.timeText, { color: theme.text }]}>{item.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.clientInfo}>
          <Text style={[styles.clientName, { color: theme.text }]}>{item.clientName}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>{item.clientPhone}</Text>
          </View>
        </View>

        <View style={[styles.serviceInfo, { backgroundColor: theme.surface }]}>
          <View style={styles.infoRow}>
            <Ionicons name="cut-outline" size={16} color={theme.primary} />
            <Text style={[styles.serviceText, { color: theme.text }]}>{item.serviceName}</Text>
          </View>
          <Text style={[styles.priceText, { color: theme.text }]}>${item.price}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton, { backgroundColor: theme.danger }]}
              onPress={() => handleCancel(item.id)}
            >
              <Text style={styles.cancelButtonText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton, { backgroundColor: theme.success }]}
              onPress={() => handleConfirm(item.id)}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'confirmed' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton, { backgroundColor: theme.primary }]}
            onPress={() => handleComplete(item.id)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.completeButtonText}>Marcar como completada</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <Text style={[styles.title, { color: theme.headerText }]}>Mis Citas</Text>
        <Text style={[styles.subtitle, { color: theme.headerText }]}>
          {filteredAppointments.length} cita{filteredAppointments.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={[styles.filterBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => setFilterMenuOpen(true)}
        >
          <Ionicons name="funnelsharp" size={20} color={theme.primary} />
          <Text style={[styles.filterButtonText, { color: theme.text }]}>{getFilterLabel()}</Text>
          <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={filterMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterMenuOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterMenuOpen(false)}
        >
          <View style={[styles.filterModal, { backgroundColor: theme.surface }]}>
            <Text style={[styles.filterModalTitle, { color: theme.text }]}>Filtrar citas</Text>
            
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  { borderBottomColor: theme.divider },
                  filter === option.key && { backgroundColor: theme.primary + '15' }
                ]}
                onPress={() => {
                  setFilter(option.key as any);
                  setFilterMenuOpen(false);
                }}
              >
                <Ionicons 
                  name={option.icon as any} 
                  size={22} 
                  color={filter === option.key ? theme.primary : theme.textSecondary}
                />
                <Text style={[
                  styles.filterOptionText,
                  { color: theme.text },
                  filter === option.key && { fontWeight: 'bold', color: theme.primary }
                ]}>
                  {option.label}
                </Text>
                {filter === option.key && (
                  <Ionicons name="checkmark" size={22} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No hay citas en esta categoría</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#2c3e50',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
  },
  listContent: {
    padding: 15,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
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
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 60,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dateMonth: {
    fontSize: 12,
    color: '#7f8c8d',
    textTransform: 'uppercase',
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  timeText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    height: 30,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 15,
  },
  clientInfo: {
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
  },
  serviceText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 20,
  },
  filterBar: {
    padding: 15,
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});
