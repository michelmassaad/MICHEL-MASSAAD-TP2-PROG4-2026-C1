# TP2 — Red Social · UTN Avellaneda

**Alumno:** Michel Massaad
**Materia:** Programación IV — 2026 C1

---

## 🚀 Deploy

| | URL |
|---|---|
| **Frontend** | [https://michel-massaad-tp-2-prog-4-2026-c1.vercel.app](https://michel-massaad-tp-2-prog-4-2026-c1.vercel.app) |
| **Backend** | [https://michel-massaad-tp2-prog4-2026-c1.onrender.com](https://michel-massaad-tp2-prog4-2026-c1.onrender.com) |

> ⚠️ El backend corre en el plan gratuito de Render. Si tarda en responder
> en el primer request, es el cold start del servidor (puede tardar hasta 60 segundos).
> Los requests siguientes son inmediatos.

---

## 🛠️ Tecnologías

### Frontend
- **Angular 21** — Standalone Components, Signals, Computed, Reactive Forms, Lazy Loading
- **Bootstrap 5** + Bootstrap Icons — diseño y componentes UI
- **TypeScript** — tipado estático

### Backend
- **NestJS 11** — framework Node.js con módulos, controllers y services
- **MongoDB Atlas** + **Mongoose** — base de datos NoSQL en la nube
- **JWT** (JSON Web Tokens) almacenados en **Cookies HttpOnly**
- **bcryptjs** — encriptación de contraseñas
- **Cloudinary** — almacenamiento de imágenes en la nube
- **class-validator** — validación de DTOs

### Deploy
- **Vercel** — frontend Angular (SPA estática con CDN global)
- **Render** — backend NestJS (servidor Node.js)

---

## 📦 Sprints

### Sprint #1 ✅

**Frontend:**
- Pantallas: Registro, Login, Publicaciones (placeholder), Mi Perfil (placeholder)
- Formulario de Login con validaciones: correo o nombre de usuario, mínimo 8 caracteres, una mayúscula y un número
- Formulario de Registro con todos los campos requeridos: nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve e imagen de perfil
- Navegación entre pantallas sin límites de accesibilidad
- Favicon propio
- Botones con tres estados visuales (normal / cargando / éxito)
- Deploy en Vercel

**Backend:**
- Módulos: Autenticación, Usuarios, Publicaciones
- `POST /api/auth/registro` — recibe FormData, valida con DTOs, encripta contraseña con bcryptjs, sube imagen a Cloudinary y guarda URL en MongoDB
- `POST /api/auth/login` — valida credenciales (correo o username), compara hash, genera JWT y lo setea en cookie HttpOnly
- `GET /api/auth/me` — verifica la cookie y devuelve los datos del usuario (para restaurar sesión al recargar)
- `POST /api/auth/logout` — borra la cookie del browser
- Deploy en Render

---

### Sprint #2 ✅

**Frontend:**
- Feed de publicaciones ordenado por fecha por defecto
- Cambio de ordenamiento a "más gustados" con feedback visual (spinner en botón mientras carga)
- Paginación tipo "load more" — carga 10 publicaciones y agrega más con el botón "Ver más"
- Cada publicación renderizada con el componente `TarjetaPublicacion`
- Dar y quitar me gusta con **actualización optimista** (la UI responde al instante)
- Eliminar publicaciones propias con **modal de confirmación** (sin `confirm()`)
- Crear publicaciones con título, descripción e imagen opcional
- Sección de comentarios en cada tarjeta (visualización preparada para Sprint 3)
- Mi Perfil: avatar, nombre, datos completos del usuario y últimas 3 publicaciones
- Navbar que detecta si estás en login/registro para no cambiar de estado durante la navegación

**Backend:**
- `POST /api/publicaciones` — crea publicación con imagen opcional en Cloudinary
- `GET /api/publicaciones` — lista publicaciones con parámetros `offset`, `limit`, `ordenarPor` (fecha/likes) y `autorId`
- `DELETE /api/publicaciones/:id` — baja lógica, solo el autor o un administrador
- `POST /api/publicaciones/:id/like` — agrega like (un like por usuario)
- `DELETE /api/publicaciones/:id/like` — elimina like (solo si el usuario lo había dado)
- Respuestas con status HTTP correctos: 201, 200, 400, 401, 403, 404, 409

---

## 🔐 Autenticación

El sistema usa **JWT almacenado en cookies HttpOnly** en lugar de localStorage:

- La cookie es invisible para JavaScript (protección contra XSS)
- El browser la envía automáticamente en cada request
- En producción usa `sameSite: 'none'` + `secure: true` para funcionar entre dominios distintos (Vercel → Render)
- Los tokens expiran en **15 minutos**
- Al recargar la página, el frontend llama a `/api/auth/me` para verificar si la cookie sigue vigente

---

## 📁 Estructura del proyecto

```
tp2-red-social/
├── frontend/          ← Angular 21
│   ├── src/
│   │   ├── app/       ← rutas y configuración
│   │   ├── components/← login, registro, publicaciones, mi-perfil, navbar, tarjeta
│   │   ├── services/  ← auth, publicaciones
│   │   ├── guards/    ← authGuard, guestGuard
│   │   ├── models/    ← interfaces TypeScript
│   │   └── environments/ ← URLs por entorno
│   └── vercel.json
│
└── backend/           ← NestJS 11
    └── src/
        ├── auth/      ← controller, service, guard, DTOs
        ├── usuarios/  ← schema, service
        ├── publicaciones/ ← controller, service, schema, DTOs
        └── cloudinary/← servicio de upload
```