import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useAppointments } from '../../context/AppContext';
import { mockServices } from '../../data/mockData';

export default function BookAppointmentScreen({ route, navigation }: any) {
  const { barber, barbershop } = route.params;
  const { user } = useAuth();
  const { addAppointment } = useAppointments();

  if (!user) return null;

  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Generar fechas disponibles (próximos 7 días)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('es-MX', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00'
  ];

  const toggleServiceSelection = (service: any) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      // Verificar si se intenta combinar Corte (id: 1) y Premium (id: 2)
      const hasCorte = selectedServices.some(s => s.id === '1');
      const hasPremium = selectedServices.some(s => s.id === '2');
      
      if ((service.id === '1' && hasPremium) || (service.id === '2' && hasCorte)) {
        Alert.alert(
          'Opciones no combinables',
          'No puedes seleccionar "Corte" y "Premium" en la misma cita. Por favor, elige una u otra opción.',
          [{ text: 'Entendido' }]
        );
        return;
      }
      
      setSelectedServices([...selectedServices, service]);
    }
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const getServicesNames = () => {
    return selectedServices.map(s => s.name).join(', ');
  };

  const handleBooking = () => {
    if (selectedServices.length === 0 || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Por favor selecciona al menos un servicio, fecha y hora');
      return;
    }

    addAppointment({
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone || '',
      barberId: barber.id,
      barberName: barber.name,
      barbershopId: barbershop.id,
      barbershopName: barbershop.name,
      serviceId: selectedServices.map(s => s.id).join(','),
      serviceName: getServicesNames(),
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      price: getTotalPrice()
    });

    Alert.alert(
      '¡Cita Agendada Exitosamente! ✅',
      `Tu cita ha sido agendada para el ${selectedDate} a las ${selectedTime}.\n\n¡Gracias por confiar en nosotros!`,
      [
        {
          text: 'Ver mis citas',
          onPress: () => navigation.navigate('ClientTabs', { screen: 'MyAppointments' })
        },
        {
          text: 'Aceptar',
          onPress: () => navigation.navigate('ClientTabs', { screen: 'Home' })
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: barber.photo }} style={styles.barberPhoto} />
        <View style={styles.barberInfo}>
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text style={styles.barbershopName}>{barbershop.name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona servicios</Text>
        <Text style={styles.sectionSubtitle}>Puedes seleccionar múltiples servicios</Text>
        {mockServices.map((service) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                isSelected && styles.selectedCard
              ]}
              onPress={() => toggleServiceSelection(service)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceDuration}>⏱️ {service.duration} min</Text>
              </View>
              <View style={styles.servicePrice}>
                <Text style={styles.priceAmount}>${service.price}</Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona una fecha</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableDates.map((item) => (
            <TouchableOpacity
              key={item.date}
              style={[
                styles.dateCard,
                selectedDate === item.date && styles.selectedDateCard
              ]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={[
                styles.dateText,
                selectedDate === item.date && styles.selectedDateText
              ]}>
                {item.display}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona una hora</Text>
        <View style={styles.timeGrid}>
          {availableTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.selectedTimeCard
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedServices.length > 0 && selectedDate && selectedTime && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de tu cita</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicios:</Text>
            <Text style={styles.summaryValue}>{getServicesNames()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duración total:</Text>
            <Text style={styles.summaryValue}>{getTotalDuration()} min</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha:</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hora:</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio total:</Text>
            <Text style={styles.summaryTotal}>${getTotalPrice()}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirmar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  barberPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  barberInfo: {
    marginLeft: 15,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  barbershopName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#27ae60',
    backgroundColor: '#e8f8f5',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  serviceDuration: {
    fontSize: 12,
    color: '#95a5a6',
  },
  servicePrice: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  dateCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedDateCard: {
    backgroundColor: '#3498db',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedTimeCard: {
    backgroundColor: '#3498db',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  selectedTimeText: {
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  bookButton: {
    backgroundColor: '#2c3e50',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
