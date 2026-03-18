import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';

const { width } = Dimensions.get('window');

export default function BarberProfileScreen({ route, navigation }: any) {
  const { barber, barbershop } = route.params;
  const { theme } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Image source={{ uri: barber.photo }} style={[styles.profilePhoto, { borderColor: theme.surface }]} />
        <Text style={[styles.name, { color: theme.text }]}>{barber.name}</Text>
        <Text style={[styles.specialty, { color: theme.textSecondary }]}>{barber.specialty}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#f39c12" />
            <Text style={[styles.statValue, { color: theme.text }]}>{barber.rating}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>{barber.experience}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Experiencia</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cut" size={20} color={theme.success} />
            <Text style={[styles.statValue, { color: theme.text }]}>500+</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cortes</Text>
          </View>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Portafolio</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Ejemplos de trabajos realizados
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.portfolioScroll}
          >
            {barber.portfolioImages.map((image: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image
                  source={{ uri: image }}
                  style={[
                    styles.portfolioImage,
                    selectedImageIndex === index && [styles.selectedImage, { borderColor: theme.primary }]
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedImageIndex !== null && (
            <Image
              source={{ uri: barber.portfolioImages[selectedImageIndex] }}
              style={styles.featuredImage}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Especialidades</Text>
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: theme.primary }]}>
              <Text style={styles.tagText}>Fade</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: theme.primary }]}>
              <Text style={styles.tagText}>Barba</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: theme.primary }]}>
              <Text style={styles.tagText}>Clásico</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: theme.primary }]}>
              <Text style={styles.tagText}>Diseño</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Reseñas</Text>
          
          <View style={[styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100' }}
                style={styles.reviewerPhoto}
              />
              <View style={styles.reviewerInfo}>
                <Text style={[styles.reviewerName, { color: theme.text }]}>Pedro González</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#f39c12" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
              Excelente servicio, muy profesional y atento. El corte quedó perfecto!
            </Text>
          </View>

          <View style={[styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                style={styles.reviewerPhoto}
              />
              <View style={styles.reviewerInfo}>
                <Text style={[styles.reviewerName, { color: theme.text }]}>Luis Ramírez</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#f39c12" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
              Siempre sabe exactamente lo que necesito. Muy recomendado!
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('BookAppointment', { barber, barbershop })}
        >
          <Text style={styles.bookButtonText}>Agendar Cita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  specialty: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 15,
  },
  portfolioScroll: {
    marginBottom: 15,
  },
  portfolioImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    opacity: 0.6,
  },
  selectedImage: {
    opacity: 1,
    borderWidth: 3,
  },
  featuredImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  bookButton: {
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
