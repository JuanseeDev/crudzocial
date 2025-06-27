# Crudzocial - Sistema de Gestión Social

**Nombre del proyecto:** Crudzocial

## 👥 Equipo de Desarrollo

- **Integrantes:** Juan Sebastián Díaz, Jose Miguel Cortes, Brandon Stiven Arredondo, Adrian Alesis Arboleda, Estefania Andrea Castro
- **Clan:** Berners Lee

## 📋 Descripción del Sistema

Crudzocial es un sistema web de gestión social que permite a los usuarios crear, leer, actualizar y eliminar (CRUD) notas e imágenes. El sistema cuenta con un robusto sistema de autenticación, control de permisos por roles y un completo panel de administración.

### 🎯 Objetivo

Proporcionar una plataforma segura y fácil de usar donde los usuarios puedan:
- Gestionar sus notas personales
- Subir y organizar imágenes
- Administrar el sistema (solo administradores)
- Mantener un registro completo de actividades

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Almacenamiento:**
  - `localStorage` para datos persistentes
  - `sessionStorage` para sesiones activas
- **Estilos:** CSS Vanilla con diseño responsivo
- **Funcionalidades JavaScript:**
  - Funciones declaradas, anónimas y autoejecutables
  - Manejo del DOM con `innerHTML`
  - Event listeners con `addEventListener`
  - Estructuras de datos (arrays y objetos)
  - Promises para manejo asíncrono

## 🚀 Cómo Ejecutar y Probar el Sistema

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (Live Server, http-server, o similar)

### Instalación y Ejecución

1. **Clonar o descargar el proyecto**
   ```bash
   git clone https://github.com/JuanseeDev/crudzocial
   cd crudzocial
   ```

2. **Instalar dependencias (opcional para desarrollo)**
   ```bash
   bun install
   ```

3. **Ejecutar servidor de desarrollo**
   ```bash
   bun run dev
   ```
   O usar cualquier servidor local apuntando a la carpeta del proyecto.

4. **Acceder al sistema**
   - Abrir el navegador en `http://localhost:puerto`
   - Ir a `login.html` para comenzar

### 🔑 Credenciales de Prueba

- **Administrador:** `admin@crudzocial.com`
- **Usuario regular:** Cualquier email válido (se crea automáticamente)

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **Inicio de sesión** con validación de email
- **Registro automático** de nuevos usuarios
- **Usuario admin** creado por defecto
- **Guardian de sesión** (middleware) que protege rutas

### 👤 Gestión de Usuarios
- **Roles diferenciados:** Admin y Usuario regular
- **Control de acceso** basado en permisos
- **Sesiones persistentes** entre recargas del navegador

### 📝 Gestión de Notas
- **Crear notas** con título y contenido
- **Editar notas** propias o todas (admin)
- **Eliminar notas** con confirmación
- **Visualización** filtrada por usuario/admin

### 🖼️ Gestión de Imágenes
- **Subir imágenes** con descripción
- **Previsualización** de imágenes
- **Validación** de tipo y tamaño
- **Eliminación** con confirmación

### 👨‍💼 Panel de Administración
- **Vista de todos los usuarios** del sistema
- **Gestión completa** de notas e imágenes de cualquier usuario
- **Registro de actividades** (logs) del sistema
- **Acceso exclusivo** para administradores

### 📊 Sistema de Logs
- **Registro automático** de todas las actividades
- **Seguimiento** de login, logout, CRUD operations
- **Información detallada** con timestamps y usuarios
- **Visualización ordenada** por fecha

## 💾 Uso de localStorage y sessionStorage

### localStorage (Datos Persistentes)
```javascript
// Estructura de datos almacenados
{
  "crudzocial_users": [
    {
      "id": "unique_id",
      "email": "user@example.com",
      "role": "admin|user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "crudzocial_notes": [
    {
      "id": "unique_id",
      "userId": "user_id",
      "userEmail": "user@example.com",
      "title": "Título de la nota",
      "content": "Contenido de la nota",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "crudzocial_images": [
    {
      "id": "unique_id",
      "userId": "user_id",
      "userEmail": "user@example.com",
      "filename": "imagen.jpg",
      "description": "Descripción",
      "data": "data:image/jpeg;base64,...",
      "size": 1024,
      "type": "image/jpeg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "crudzocial_logs": [
    {
      "id": "unique_id",
      "userId": "user_id",
      "userEmail": "user@example.com",
      "action": "LOGIN|LOGOUT|CREATE_NOTE|UPDATE_NOTE|DELETE_NOTE|UPLOAD_IMAGE|DELETE_IMAGE",
      "details": "Descripción de la acción",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### sessionStorage (Sesión Activa)
```javascript
{
  "crudzocial_current_user": {
    "id": "unique_id",
    "email": "user@example.com",
    "role": "admin|user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔧 Implementación de Funciones JavaScript

### Funciones Declaradas
```javascript
function initializeDefaultData() { /* ... */ }
function generateId() { /* ... */ }
function logActivity(action, details) { /* ... */ }
function getCurrentUser() { /* ... */ }
function handleLogin(email) { /* ... */ }
```

### Funciones Anónimas
```javascript
const initLoginPage = function() { /* ... */ };
const initMainPage = function() { /* ... */ };
const initAdminPage = function() { /* ... */ };
```

### Funciones Autoejecutables (IIFE)
```javascript
(function() {
    initializeDefaultData();
    if (!checkAuth()) return;
    // Inicialización automática del sistema
})();
```

## 🔐 Permisos del Administrador

El administrador tiene permisos especiales que incluyen:

1. **Acceso al panel de administración** (`users.html`)
2. **Visualización de todos los usuarios** del sistema
3. **Gestión completa** de notas e imágenes de cualquier usuario
4. **Edición y eliminación** de contenido de otros usuarios
5. **Acceso al registro completo** de actividades (logs)
6. **Vista global** del sistema sin restricciones

### Implementación de Permisos
```javascript
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Verificación en operaciones CRUD
if (notes[noteIndex].userId === user.id || user.role === 'admin') {
    // Permitir operación
}
```

## 📈 Sistema de Logs

Todas las actividades del sistema se registran automáticamente:

- **LOGIN/LOGOUT:** Inicio y cierre de sesión
- **REGISTER:** Registro de nuevos usuarios
- **CREATE_NOTE:** Creación de notas
- **UPDATE_NOTE:** Edición de notas
- **DELETE_NOTE:** Eliminación de notas
- **UPLOAD_IMAGE:** Subida de imágenes
- **DELETE_IMAGE:** Eliminación de imágenes

Cada log incluye:
- **ID único**
- **Usuario que realizó la acción**
- **Tipo de acción**
- **Detalles específicos**
- **Timestamp completo**

## 🎓 Aprendizajes del Equipo

Durante el desarrollo de Crudzocial, el equipo adquirió conocimientos en:

### Técnicos
- **Arquitectura MVC** en JavaScript vanilla
- **Gestión de estado** con Web Storage APIs
- **Seguridad frontend** y validación de permisos
- **Manejo asíncrono** con Promises y FileReader API
- **DOM manipulation** avanzada con innerHTML
- **Event delegation** y manejo eficiente de eventos
- **Responsive design** con CSS Grid y Flexbox

### Funcionales
- **Diseño de sistemas** de autenticación y autorización
- **Modelado de datos** para aplicaciones web
- **UX/UI design** centrado en el usuario
- **Logging y auditoría** de sistemas
- **Gestión de archivos** en el navegador

### Buenas Prácticas
- **Código modular** y reutilizable
- **Separación de responsabilidades**
- **Validación de datos** en múltiples capas
- **Manejo de errores** robusto
- **Accesibilidad web** básica
- **Optimización de rendimiento**

## 📊 Estado Actual del Proyecto

### ✅ Completado
- [x] Sistema de autenticación completo
- [x] CRUD de notas con permisos
- [x] CRUD de imágenes con validación
- [x] Panel de administración funcional
- [x] Sistema de logs completo
- [x] Guardian de sesión (middleware)
- [x] Diseño responsivo
- [x] Persistencia con localStorage/sessionStorage
- [x] Validaciones de frontend
- [x] Interfaz de usuario intuitiva

### 🔄 En Desarrollo
- [ ] Búsqueda y filtrado avanzado
- [ ] Exportación de datos
- [ ] Temas personalizables
- [ ] Notificaciones en tiempo real

### 🚀 Funcionalidades Futuras
- [ ] Integración con backend
- [ ] Base de datos real
- [ ] API REST
- [ ] Autenticación con JWT
- [ ] Upload de múltiples archivos
- [ ] Categorización de notas
- [ ] Compartir contenido entre usuarios

## 🐛 Problemas Conocidos

- **Limitación de almacenamiento:** localStorage tiene límite de ~5-10MB
- **Seguridad:** Al ser frontend-only, la seguridad es limitada
- **Compatibilidad:** Funciona mejor en navegadores modernos
- **Performance:** Puede ralentizarse con muchos datos

## 📞 Soporte y Contribuciones

Para reportar bugs, solicitar funcionalidades o contribuir al proyecto:

1. **Issues:** Crear un issue en el repositorio
2. **Pull Requests:** Seguir las convenciones de código establecidas
3. **Documentación:** Mantener la documentación actualizada

---

**Versión:** 1.0.0
**Fecha de creación:** Junio 2025
**Licencia:** RIWI
**Contacto:** info@riwi.io