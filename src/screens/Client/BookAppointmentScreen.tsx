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

  const [selectedService, setSelectedService] = useState<any>(null);
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

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Por favor selecciona servicio, fecha y hora');
      return;
    }

    addAppointment({
      clientId: user!.id,
      clientName: user!.name,
      clientPhone: user!.phone || '',
      barberId: barber.id,
      barberName: barber.name,
      barbershopId: barbershop.id,
      barbershopName: barbershop.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      price: selectedService.price
    });

    Alert.alert(
      '¡Cita Agendada!',
      `Tu cita ha sido agendada para el ${selectedDate} a las ${selectedTime}`,
      [
        {
          text: 'Ver mis citas',
          onPress: () => navigation.navigate('MyAppointments')
        },
        {
          text: 'Aceptar',
          onPress: () => navigation.navigate('Home')
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
        <Text style={styles.sectionTitle}>Selecciona un servicio</Text>
        {mockServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              selectedService?.id === service.id && styles.selectedCard
            ]}
            onPress={() => setSelectedService(service)}
          >
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <Text style={styles.serviceDuration}>⏱️ {service.duration} min</Text>
            </View>
            <View style={styles.servicePrice}>
              <Text style={styles.priceAmount}>${service.price}</Text>
              {selectedService?.id === service.id && (
                <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
              )}
            </View>
          </TouchableOpacity>
        ))}
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

      {selectedService && selectedDate && selectedTime && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de tu cita</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicio:</Text>
            <Text style={styles.summaryValue}>{selectedService.name}</Text>
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
            <Text style={styles.summaryLabel}>Precio:</Text>
            <Text style={styles.summaryTotal}>${selectedService.price}</Text>
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
