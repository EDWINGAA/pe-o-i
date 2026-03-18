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
import { useTheme } from '../../context/AppContext';
import { mockBarbers } from '../../data/mockData';

export default function BarbershopDetailScreen({ route, navigation }: any) {
  const { barbershop } = route.params;
  const { theme } = useTheme();
  const barbers = mockBarbers.filter(b => b.barbershopId === barbershop.id);

  const renderBarberCard = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.barberCard, { backgroundColor: theme.surface, borderColor: theme.divider }]}
      onPress={() => navigation.navigate('BarberProfile', { barber: item, barbershop })}
    >
      <Image source={{ uri: item.photo }} style={styles.barberPhoto} />
      <View style={styles.barberInfo}>
        <Text style={[styles.barberName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.barberSpecialty, { color: theme.textSecondary }]}>{item.specialty}</Text>
        <View style={styles.barberRating}>
          <Ionicons name="star" size={14} color="#f39c12" />
          <Text style={[styles.ratingText, { color: theme.text }]}>{item.rating}</Text>
          <Text style={[styles.experienceText, { color: theme.textSecondary }]}> • {item.experience}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.disabled} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: barbershop.image }} style={styles.headerImage} />
      
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>{barbershop.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#f39c12" />
          <Text style={[styles.rating, { color: theme.text }]}>{barbershop.rating}</Text>
          <Text style={[styles.reviews, { color: theme.textSecondary }]}>(234 reseñas)</Text>
        </View>

        <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.text }]}>{barbershop.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.text }]}>{barbershop.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.text }]}>
              {barbershop.openTime} - {barbershop.closeTime}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Acerca de</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>{barbershop.description}</Text>
        </View>

        <View style={styles.barbersSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Nuestros Barberos</Text>
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
  },
  reviews: {
    marginLeft: 5,
    fontSize: 14,
  },
  infoSection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  barbersSection: {
    marginBottom: 20,
  },
  barberCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  barberSpecialty: {
    fontSize: 13,
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
  },
  experienceText: {
    fontSize: 12,
  },
});
