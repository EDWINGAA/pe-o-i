import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AppContext';
import { useTheme } from '../../context/AppContext';
import { mockBarbershops } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) return null;

  const renderBarbershopCard = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.text }]}
      onPress={() => navigation.navigate('BarbershopDetail', { barbershop: item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#f39c12" />
          <Text style={[styles.rating, { color: theme.text }]}>{item.rating}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>{item.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {item.openTime} - {item.closeTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.headerText }]}>Hola, {user?.name}! 👋</Text>
          <Text style={[styles.subtitle, { color: theme.headerText }]}>Encuentra tu barbería ideal</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.quickActions, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MyAppointments')}
          >
            <View style={[styles.actionCardIcon, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="calendar" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.actionCardText, { color: theme.text }]}>Mis Citas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionCardIcon, { backgroundColor: theme.danger + '15' }]}>
              <Ionicons name="heart" size={32} color={theme.danger} />
            </View>
            <Text style={[styles.actionCardText, { color: theme.text }]}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionCardIcon, { backgroundColor: theme.success + '15' }]}>
              <Ionicons name="ticket" size={32} color={theme.success} />
            </View>
            <Text style={[styles.actionCardText, { color: theme.text }]}>Ofertas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Barberías Destacadas</Text>
          <FlatList
            data={mockBarbershops}
            renderItem={renderBarbershopCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  actionCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  actionCardIcon: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionCardText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#2c3e50',
  },
});
