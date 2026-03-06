# ForBids - Plataforma de Compraventa y Subastas de Segunda Mano

Proyecto intermodular de Desarrollo de Aplicaciones Web: aplicación web de compraventa de segunda mano que combina publicación de productos, interacción social (likes y comentarios) y subastas.

## 🛠 Stack Tecnológico

### Frontend
- **React 18** - Librería de interfaz de usuario
- **Vite** - Bundler y servidor de desarrollo ultrarrápido
- **React Router v6** - Navegación entre páginas
- **Bootstrap 5** - Framework CSS para diseño responsive
- **Prettier** - Formateador de código

### Backend (Próximamente)
- **Spring Boot** - Framework Java
- **JPA/Hibernate** - ORM para base de datos
- **MySQL/PostgreSQL** - Base de datos

## 📋 Requisitos Previos

- Node.js >= 16.x
- npm >= 8.x

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173/`

### 3. Compilar para producción
```bash
npm run build
```

### 4. Ver vista previa de producción
```bash
npm run preview
```

### 5. Formatear código
```bash
npm run format
```

## 📁 Estructura del Proyecto

```
forbids-proyectointermodular/
├── src/
│   ├── pages/                 # Componentes de páginas
│   │   ├── Landing.jsx       # Página de inicio
│   │   ├── Home.jsx          # Dashboard
│   │   ├── Login.jsx         # Iniciar sesión
│   │   ├── Register.jsx      # Registro
│   │   ├── Profile.jsx       # Perfil de usuario
│   │   ├── PrivacyPolicy.jsx # Política de privacidad
│   │   └── TermsConditions.jsx
│   ├── components/            # Componentes reutilizables
│   │   └── Footer.jsx        # Footer compartido
│   ├── styles/               # Estilos CSS
│   │   ├── landing.css
│   │   ├── home.css
│   │   └── auth.css
│   ├── App.jsx               # Componente principal con routing
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales
├── index.html                # HTML principal
├── vite.config.js            # Configuración de Vite
├── package.json              # Dependencias y scripts
├── .prettierrc                # Configuración de Prettier
└── .gitignore                # Archivos excluidos de Git

```

## 🎨 Características Actuales

✅ Landing page con hero section
✅ Página de inicio (home) con navbar
✅ Login y Registro con validación
✅ Perfil de usuario
✅ Páginas de políticas y términos
✅ Diseño responsive con Bootstrap 5
✅ Footer consistente en todas las páginas
✅ Routing entre páginas sin recargas (SPA)
✅ Código formateado y limpio

## 🔄 Próximas Características

🔲 Conexión con backend Spring Boot
🔲 Autenticación JWT
🔲 Catálogo de productos
🔲 Sistema de subastas
🔲 Likes y comentarios
🔲 Chat en tiempo real
🔲 Dashboard de vendedor

## 📝 Notas Importantes

- El proyecto está migrado desde HTML vanilla a React
- Bootstrap se importa globalmente en `src/main.jsx`
- Utiliza React Router v6 para navegación
- El servidor Vite incluye Hot Module Replacement (HMR)

## 👨‍💻 Contribución

Para contribuir al proyecto:
1. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`
2. Commit tus cambios: `git commit -m 'Add some AmazingFeature'`
3. Push a la rama: `git push origin feature/AmazingFeature`
4. Abre un Pull Request

## 📄 Licencia

ISC - Ver archivo LICENSE para más detalles

## 📞 Contacto

Para preguntas o sugerencias sobre el proyecto, abre un issue en el repositorio de GitHub.

---

**Estado del Proyecto:** 🚧 En desarrollo
**Última actualización:** Febrero 2026
