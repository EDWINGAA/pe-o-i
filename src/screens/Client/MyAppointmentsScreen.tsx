import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useAppointments, useTheme } from '../../context/AppContext';

export default function MyAppointmentsScreen() {
  const { user } = useAuth();
  const { getUserAppointments } = useAppointments();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  if (!user) return null;

  const allAppointments = getUserAppointments(user.id);
  
  const filteredAppointments = filter === 'all'
    ? allAppointments
    : allAppointments.filter(apt => apt.status === filter);

  const filterOptions = [
    { key: 'all', label: 'Todas', icon: 'list' },
    { key: 'confirmed', label: 'Confirmadas', icon: 'checkmark-circle' },
    { key: 'pending', label: 'Pendientes', icon: 'time' },
    { key: 'completed', label: 'Completadas', icon: 'trophy' },
    { key: 'cancelled', label: 'Canceladas', icon: 'close-circle' }
  ];

  const getFilterLabel = () => {
    return filterOptions.find(opt => opt.key === filter)?.label || 'Filtro';
  };

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

  const renderAppointment = ({ item }: any) => (
    <View style={[styles.appointmentCard, { backgroundColor: theme.surface, shadowColor: theme.text }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.barbershopName, { color: theme.text }]}>{item.barbershopName}</Text>
          <Text style={[styles.barberName, { color: theme.textSecondary }]}>con {item.barberName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={[styles.cardDivider, { backgroundColor: theme.divider }]} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="cut-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.text }]}>{item.serviceName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.text }]}>{item.date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.text }]}>{item.time}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.priceText, { color: theme.text }]}>${item.price}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.cardFooter}>
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.danger }]}>
            <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.detailsButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      )}
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
          <Text style={[styles.emptyText, { color: theme.text }]}>No tienes citas agendadas</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Explora barberías y agenda tu próxima cita
          </Text>
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
  },
  priceText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#2c3e50',
    textAlign: 'center',
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
    maxHeight: '70%',
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
