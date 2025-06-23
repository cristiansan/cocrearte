# 🧠 Cocrearte

**Cocrearte** es una plataforma web diseñada para psicólogos y terapeutas que trabajan de manera colaborativa en un espacio físico común. La app permite gestionar pacientes, agendar sesiones, registrar pagos y compartir el uso del espacio de trabajo a través de un modelo de comisión.

## ✨ Objetivo

Brindar una herramienta simple y eficaz para:

- Llevar fichas y notas de pacientes.
- Registrar resúmenes de sesiones.
- Gestionar pagos y comisiones.
- Permitir que múltiples terapeutas utilicen el espacio compartido bajo una misma plataforma.

## 🎯 Público objetivo

- Psicólogos y terapeutas que trabajan en el **Espacio Cocrearte**.
- Administradores del espacio que gestionan la reserva de turnos y el uso físico del lugar.

---

## 🛠️ Funcionalidades principales

### Terapeutas
- Registro e inicio de sesión.
- Acceso a ficha de cada paciente.
- Carga y visualización de:
  - Notas personales.
  - Resúmenes de sesiones.
  - Historial de pagos.
- Calendario de sesiones.
- Recepción de reservas de pacientes.

### Pacientes
- Reserva de sesiones desde la web.
- Pago anticipado del 30% para confirmar la sesión.
- Recordatorios automáticos.

### Administración del Espacio
- Registro automático del 30% de comisión sobre cada sesión confirmada.
- Gestión de terapeutas activos.
- Visualización de calendario general del espacio.

---

## 💸 Modelo de negocio

- El **30% del valor de cada sesión** corresponde al uso del espacio físico y se cobra como seña al momento de reservar.
- Cada terapeuta abona esta comisión mediante el pago anticipado del paciente.
- El terapeuta cobra el 70% restante de la sesión directamente.

---

## 📦 Stack Tecnológico

| Stack | Tecnologías |
|-------|-------------|
| Frontend | React / Next.js / Tailwind CSS |
| Backend | Firebase (Firestore, Auth, Functions) |
| Base de datos | Firestore |
| Autenticación | Firebase Auth |
| Pasarela de pago | MercadoPago / Stripe |
| Hosting | Vercel / Firebase Hosting |

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd cocrearte-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar Firebase**
   - El archivo `src/config/firebase.js` ya está configurado con las credenciales del proyecto
   - Asegúrate de tener habilitados los servicios de Authentication y Firestore en tu consola de Firebase

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

---

## 📁 Estructura del Proyecto

```
cocrearte-app/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios de Firebase
│   │   ├── authService.js # Autenticación
│   │   └── sessionService.js # Gestión de sesiones
│   ├── utils/             # Utilidades y helpers
│   ├── styles/            # Estilos globales
│   └── config/            # Configuración
│       └── firebase.js    # Configuración de Firebase
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

---

## 📊 Estructura de Datos en Firestore

### Colecciones principales:
- `usuarios` - Perfiles de terapeutas y pacientes
- `sesiones` - Reservas y sesiones programadas
- `notas` - Resúmenes y notas de sesiones
- `pagos` - Historial de transacciones

### Modelo de datos:
```javascript
// Usuario
{
  uid: string,
  email: string,
  nombre: string,
  tipo: 'terapeuta' | 'paciente' | 'admin',
  telefono: string,
  especialidad: string, // solo terapeutas
  activo: boolean,
  fechaCreacion: timestamp
}

// Sesión
{
  pacienteId: string,
  terapeutaId: string,
  fecha: timestamp,
  precio: number,
  comision: number, // 30%
  montoTerapeuta: number, // 70%
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada',
  fechaCreacion: timestamp
}
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 📞 Contacto

Espacio Cocrearte - [@cocrearte](https://twitter.com/cocrearte)

Link del proyecto: [https://github.com/tu-usuario/cocrearte-app](https://github.com/tu-usuario/cocrearte-app)



