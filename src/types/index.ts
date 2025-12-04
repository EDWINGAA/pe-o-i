// Tipos para la aplicación
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'client' | 'barber';
  phone?: string;
  barberId?: string; // Si es barbero, referencia a Barber
}

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  image: string;
  description: string;
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
}

export interface Barber {
  id: string;
  name: string;
  barbershopId: string;
  photo: string;
  specialty: string;
  rating: number;
  experience: string;
  portfolioImages: string[];
}

export interface Service {
  id: string;
  name: string;
  duration: number; // en minutos
  price: number;
  description: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  barberId: string;
  barberName: string;
  barbershopId: string;
  barbershopName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}
