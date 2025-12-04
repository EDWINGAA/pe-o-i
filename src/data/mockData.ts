import { User, Barbershop, Barber, Service, Appointment } from '../types';

// Usuarios simulados
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'cliente@test.com',
    password: '123456',
    name: 'Juan Pérez',
    role: 'client',
    phone: '555-0101'
  },
  {
    id: '2',
    email: 'barbero@test.com',
    password: '123456',
    name: 'Carlos Martínez',
    role: 'barber',
    phone: '555-0202',
    barberId: '1'
  },
  {
    id: '3',
    email: 'barbero2@test.com',
    password: '123456',
    name: 'Miguel Ángel',
    role: 'barber',
    phone: '555-0203',
    barberId: '2'
  }
];

// Barberías simuladas
export const mockBarbershops: Barbershop[] = [
  {
    id: '1',
    name: 'Barbería El Clásico',
    address: 'Calle Principal #123, Centro',
    phone: '555-1000',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    description: 'La mejor barbería tradicional de la ciudad con más de 20 años de experiencia',
    openTime: '09:00',
    closeTime: '20:00',
    latitude: 19.432608,
    longitude: -99.133209
  },
  {
    id: '2',
    name: 'Style & Cuts',
    address: 'Av. Insurgentes #456, Col. Roma',
    phone: '555-2000',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    description: 'Barbería moderna con los mejores estilos urbanos',
    openTime: '10:00',
    closeTime: '21:00',
    latitude: 19.421608,
    longitude: -99.163209
  },
  {
    id: '3',
    name: 'Barbershop Premium',
    address: 'Blvd. Miguel de Cervantes #789',
    phone: '555-3000',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
    description: 'Experiencia premium en cortes y cuidado personal',
    openTime: '09:00',
    closeTime: '22:00',
    latitude: 19.442608,
    longitude: -99.143209
  },
  {
    id: '4',
    name: 'La Navaja de Oro',
    address: 'Calle Juárez #321, Centro Histórico',
    phone: '555-4000',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1598523537291-14c52c24070d?w=400',
    description: 'Tradición y calidad en cada corte',
    openTime: '08:00',
    closeTime: '19:00',
    latitude: 19.452608,
    longitude: -99.153209
  }
];

// Barberos simulados
export const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'Carlos Martínez',
    barbershopId: '1',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    specialty: 'Cortes clásicos y barbas',
    rating: 4.9,
    experience: '15 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300'
    ]
  },
  {
    id: '2',
    name: 'Miguel Ángel',
    barbershopId: '1',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    specialty: 'Estilos modernos y fade',
    rating: 4.7,
    experience: '8 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300',
      'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=300'
    ]
  },
  {
    id: '3',
    name: 'Roberto Sánchez',
    barbershopId: '2',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    specialty: 'Diseños y afeitado clásico',
    rating: 4.8,
    experience: '12 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=300',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300'
    ]
  },
  {
    id: '4',
    name: 'David Hernández',
    barbershopId: '2',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    specialty: 'Cortes urbanos y tendencias',
    rating: 4.6,
    experience: '6 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=300',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300'
    ]
  },
  {
    id: '5',
    name: 'Antonio López',
    barbershopId: '3',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    specialty: 'Barbería premium y spa',
    rating: 5.0,
    experience: '20 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=300',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300'
    ]
  },
  {
    id: '6',
    name: 'Luis García',
    barbershopId: '3',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200',
    specialty: 'Cortes ejecutivos',
    rating: 4.8,
    experience: '10 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=300',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300'
    ]
  },
  {
    id: '7',
    name: 'Francisco Ruiz',
    barbershopId: '4',
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200',
    specialty: 'Cortes tradicionales',
    rating: 4.7,
    experience: '18 años',
    portfolioImages: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300',
      'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=300',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300'
    ]
  }
];

// Servicios simulados
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte de cabello',
    duration: 30,
    price: 150,
    description: 'Corte de cabello profesional'
  },
  {
    id: '2',
    name: 'Corte y barba',
    duration: 45,
    price: 200,
    description: 'Corte de cabello y arreglo de barba'
  },
  {
    id: '3',
    name: 'Afeitado clásico',
    duration: 30,
    price: 120,
    description: 'Afeitado con navaja y toallas calientes'
  },
  {
    id: '4',
    name: 'Corte premium',
    duration: 60,
    price: 300,
    description: 'Corte, barba y masaje facial'
  },
  {
    id: '5',
    name: 'Diseño de barba',
    duration: 20,
    price: 100,
    description: 'Diseño y perfilado de barba'
  }
];

// Citas simuladas (para el barbero)
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Juan Pérez',
    clientPhone: '555-0101',
    barberId: '1',
    barberName: 'Carlos Martínez',
    barbershopId: '1',
    barbershopName: 'Barbería El Clásico',
    serviceId: '2',
    serviceName: 'Corte y barba',
    date: '2025-12-05',
    time: '10:00',
    status: 'confirmed',
    price: 200
  },
  {
    id: '2',
    clientId: '1',
    clientName: 'Juan Pérez',
    clientPhone: '555-0101',
    barberId: '1',
    barberName: 'Carlos Martínez',
    barbershopId: '1',
    barbershopName: 'Barbería El Clásico',
    serviceId: '1',
    serviceName: 'Corte de cabello',
    date: '2025-12-08',
    time: '15:00',
    status: 'pending',
    price: 150
  },
  {
    id: '3',
    clientId: '4',
    clientName: 'María González',
    clientPhone: '555-0104',
    barberId: '1',
    barberName: 'Carlos Martínez',
    barbershopId: '1',
    barbershopName: 'Barbería El Clásico',
    serviceId: '4',
    serviceName: 'Corte premium',
    date: '2025-12-04',
    time: '16:00',
    status: 'confirmed',
    price: 300
  },
  {
    id: '4',
    clientId: '5',
    clientName: 'Pedro Ramírez',
    clientPhone: '555-0105',
    barberId: '1',
    barberName: 'Carlos Martínez',
    barbershopId: '1',
    barbershopName: 'Barbería El Clásico',
    serviceId: '3',
    serviceName: 'Afeitado clásico',
    date: '2025-12-04',
    time: '18:00',
    status: 'confirmed',
    price: 120
  }
];
