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

## 📦 Tecnologías sugeridas (propuesta inicial)

| Stack | Tecnologías |
|-------|-------------|
| Frontend | React / Next.js / Tailwind CSS |
| Backend | Node.js + Express o Firebase |
| Base de datos | Firebase / PostgreSQL / MongoDB |
| Autenticación | Firebase Auth / Auth0 |
| Pasarela de pago | MercadoPago / Stripe |
| Hosting | Vercel / Firebase Hosting |

---

## 📁 Estructura inicial (sugerida)

/cocrearte-app
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── utils/
│ └── styles/
├── .env
├── README.md
└── package.json



