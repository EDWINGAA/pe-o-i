import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockBarbers } from '../../data/mockData';

export default function BarbershopDetailScreen({ route, navigation }: any) {
  const { barbershop } = route.params;
  const barbers = mockBarbers.filter(b => b.barbershopId === barbershop.id);

  const renderBarberCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.barberCard}
      onPress={() => navigation.navigate('BarberProfile', { barber: item, barbershop })}
    >
      <Image source={{ uri: item.photo }} style={styles.barberPhoto} />
      <View style={styles.barberInfo}>
        <Text style={styles.barberName}>{item.name}</Text>
        <Text style={styles.barberSpecialty}>{item.specialty}</Text>
        <View style={styles.barberRating}>
          <Ionicons name="star" size={14} color="#f39c12" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.experienceText}> • {item.experience}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#bdc3c7" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: barbershop.image }} style={styles.headerImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{barbershop.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#f39c12" />
          <Text style={styles.rating}>{barbershop.rating}</Text>
          <Text style={styles.reviews}>(234 reseñas)</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#3498db" />
            <Text style={styles.infoText}>{barbershop.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#3498db" />
            <Text style={styles.infoText}>{barbershop.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#3498db" />
            <Text style={styles.infoText}>
              {barbershop.openTime} - {barbershop.closeTime}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <Text style={styles.description}>{barbershop.description}</Text>
        </View>

        <View style={styles.barbersSection}>
          <Text style={styles.sectionTitle}>Nuestros Barberos</Text>
          <FlatList
            data={barbers}
            renderItem={renderBarberCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  reviews: {
    marginLeft: 5,
    fontSize: 14,
    color: '#7f8c8d',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  barbersSection: {
    marginBottom: 20,
  },
  barberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  barberPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  barberInfo: {
    flex: 1,
    marginLeft: 15,
  },
  barberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  barberSpecialty: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  barberRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  experienceText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});
