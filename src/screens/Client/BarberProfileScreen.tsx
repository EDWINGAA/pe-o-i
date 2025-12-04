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

const { width } = Dimensions.get('window');

export default function BarberProfileScreen({ route, navigation }: any) {
  const { barber, barbershop } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: barber.photo }} style={styles.profilePhoto} />
        <Text style={styles.name}>{barber.name}</Text>
        <Text style={styles.specialty}>{barber.specialty}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#f39c12" />
            <Text style={styles.statValue}>{barber.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color="#3498db" />
            <Text style={styles.statValue}>{barber.experience}</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cut" size={20} color="#27ae60" />
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Cortes</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portafolio</Text>
          <Text style={styles.sectionSubtitle}>
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
                    selectedImageIndex === index && styles.selectedImage
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
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Fade</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Barba</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Clásico</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Diseño</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100' }}
                style={styles.reviewerPhoto}
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Pedro González</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#f39c12" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Excelente servicio, muy profesional y atento. El corte quedó perfecto!
            </Text>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                style={styles.reviewerPhoto}
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Luis Ramírez</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#f39c12" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Siempre sabe exactamente lo que necesito. Muy recomendado!
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
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
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  specialty: {
    fontSize: 16,
    color: '#7f8c8d',
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
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
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
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
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
    borderColor: '#3498db',
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
    backgroundColor: '#3498db',
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
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
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
    color: '#2c3e50',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  bookButton: {
    backgroundColor: '#2c3e50',
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
