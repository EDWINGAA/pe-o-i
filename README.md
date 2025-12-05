# QuickCut

Aplicación móvil para agendar citas en barberías, desarrollada con Expo y React Native.

## 🚀 Características

- ✅ Autenticación simulada (Cliente y Barbero)
- ✅ Registro de nuevos clientes
- ✅ Catálogo de barberías
- ✅ Perfiles de barberos con portafolio
- ✅ Sistema de agendamiento de citas
- ✅ Dashboard para barberos
- ✅ Gestión de citas (confirmar, completar, cancelar)
- ✅ Datos simulados localmente (sin APIs ni base de datos)

## 📱 Instalación y Ejecución

### Prerrequisitos
- Node.js instalado
- Expo Go app en tu iPhone

### Pasos

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar la aplicación:
```bash
npx expo start
```

3. Escanea el código QR con la cámara de tu iPhone o con la app Expo Go

## 🔐 Credenciales de Prueba

### Cliente
- Email: `cliente@test.com`
- Password: `123456`

### Barbero
- Email: `barbero@test.com`
- Password: `123456`

También puedes registrarte como nuevo cliente desde la aplicación.

## 📂 Estructura del Proyecto

```
src/
├── context/         # Context API para estado global
├── data/           # Datos simulados (mock data)
├── navigation/     # Configuración de navegación
├── screens/        # Pantallas de la aplicación
│   ├── Auth/       # Login y Registro
│   ├── Client/     # Pantallas del cliente
│   └── Barber/     # Pantallas del barbero
└── types/          # Tipos de TypeScript
```

## 🎨 Funcionalidades por Rol

### Cliente
- Ver catálogo de barberías
- Explorar barberos y sus portafolios
- Agendar citas
- Ver historial de citas
- Gestionar perfil

### Barbero
- Dashboard con estadísticas
- Ver citas del día
- Gestionar todas las citas
- Confirmar/Completar/Rechazar citas
- Ver ingresos totales

## 🛠 Tecnologías

- React Native
- Expo
- TypeScript
- React Navigation
- Context API
- Expo Vector Icons

## 📝 Notas

- Todos los datos son simulados y se almacenan en memoria
- No requiere conexión a internet (excepto para cargar imágenes de ejemplo)
- Las imágenes utilizan URLs de Unsplash como placeholder
- Ideal para prototipos y demostraciones
