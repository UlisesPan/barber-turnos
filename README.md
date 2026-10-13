# Chaco Barber — Sistema de turnos para barbería

Aplicación web full stack para que los clientes de una barbería reserven turnos online y el dueño administre servicios y agenda.

🔗 **Demo:** [chaco-barber.netlify.app](https://chaco-barber.netlify.app/)
> El backend corre en el plan gratuito de Render: la primera petición puede tardar unos segundos.

![Pantalla de inicio](docs/home.jpg)

---

## Funcionalidades

**Clientes**
- Registro e inicio de sesión con autenticación JWT.
- Catálogo de servicios con precio y duración.
- Reserva de turnos consultando los horarios disponibles por fecha.
- Historial de turnos propios y cancelación.
- Email de confirmación al reservar y al cancelar.
- Foto de perfil.

**Administrador**
- Alta, edición y baja de servicios.
- Bloqueo de horarios puntuales o días completos (feriados, vacaciones).
- Vista de todos los turnos.
- Aviso por email cada vez que se reserva un turno nuevo.

**Reglas de negocio**
- Turnos de lunes a jueves, cada 30 minutos, de 10:00 a 13:00 y de 16:00 a 20:00.
- Validación de superposición: no se pueden reservar dos turnos en el mismo horario.

**General**
- Modo claro / oscuro.
- Diseño responsive.

---

## Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, Vite, React Router, Axios, Context API, CSS Modules |
| Backend | Node.js, Express 5, TypeScript, TypeORM |
| Base de datos | PostgreSQL (Supabase) |
| Seguridad y validación | JWT, bcrypt, Zod, Helmet, CORS, rate limiting |
| Otros | Nodemailer (emails), Multer (subida de imágenes) |
| Deploy | Netlify (front), Render (back), GitHub Actions (keep-alive) |

---

## Arquitectura

```
barber-turnos/
├── back/                 # API REST (Express + TypeScript)
│   └── src/
│       ├── config/       # Conexión a la base de datos y variables de entorno
│       ├── entities/     # Modelos TypeORM: User, Credentials, Appointment, Category, BlockedSlot
│       ├── routes/       # Definición de endpoints
│       ├── controllers/  # Manejo de request/response
│       ├── services/     # Lógica de negocio y envío de emails
│       ├── middlewares/  # Autenticación, rol admin, validación, upload de imágenes
│       ├── schemas/      # Esquemas de validación con Zod
│       └── utils/        # Validación de horarios y fechas
└── front/                # SPA en React
    └── src/
        ├── views/        # Home, Servicios, Reservar, Mis turnos, Login, Registro, Admin
        ├── components/   # Navbar, Footer, modal de confirmación, toggle de tema
        ├── context/      # Estado de autenticación y tema
        ├── services/     # Llamadas a la API
        └── api/          # Instancia de Axios
```

El backend sigue una arquitectura en capas: **routes → controllers → services → entities**. Los endpoints protegidos pasan por un middleware que verifica el JWT, y las acciones de administración por un segundo middleware que valida el rol.

---

## Endpoints principales

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/users/register` | Público |
| POST | `/users/login` | Público |
| GET | `/categories` | Público |
| GET | `/appointments/available/:date` | Público |
| POST | `/appointments/schedule` | Usuario |
| GET | `/appointments/user/:userId` | Usuario |
| PUT | `/appointments/:id/cancel` | Usuario |
| PUT | `/users/:id/photo` | Usuario |
| GET | `/appointments` | Admin |
| POST / PUT / DELETE | `/categories` | Admin |
| POST / DELETE | `/appointments/block` | Admin |

---

## Cómo correrlo localmente

**Requisitos:** Node.js 20+ y una base de datos PostgreSQL.

```bash
git clone https://github.com/UlisesPan/barber-turnos.git
cd barber-turnos
```

**Backend**
```bash
cd back
npm install
cp .env.example .env   # completar credenciales de la base de datos, JWT y email
npm run dev
```

**Frontend**
```bash
cd front
npm install
npm run dev
```

El front corre en `http://localhost:5173` y la API en `http://localhost:3000`.

---

## Próximas mejoras

- Migrar el frontend a TypeScript.
- Guardar las imágenes en un servicio externo, ya que el disco de Render no es persistente.
- Agregar tests a la API.

---

## Autor

**Ulises Pan**: [LinkedIn](https://www.linkedin.com/in/ulises-pan) · [GitHub](https://github.com/UlisesPan)
