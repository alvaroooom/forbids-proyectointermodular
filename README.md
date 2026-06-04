# ForBids

Proyecto intermodular de **2º DAW** — IES Camas.  
**Autor:** Álvaro Muñoz Fernández (`munoz.fernandez.alvaro@iescamas.es`)

Marketplace de segunda mano con subastas en tiempo real, chat por producto, favoritos y panel de administración.

## Tecnologías

- Frontend: React + Vite + Bootstrap
- Backend: Spring Boot + MySQL + JWT
- Tiempo real: WebSocket (pujas y chat)

## Cómo arrancar

```bash
# 1. Instalar dependencias del frontend
npm install --legacy-peer-deps

# 2. Backend (requiere MySQL con la BD forbids_bd)
cd backend
mvn spring-boot:run

# 3. Frontend (otra terminal, desde la raíz)
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:8080  

MySQL por defecto: `root` / `root`, base de datos `forbids_bd`.

### Instalar la base de datos desde cero

Si no tienes la BD creada, importa el volcado completo:

```bash
mysql -u root -p < forbids.sql
```

Esto crea `forbids_bd` con todas las tablas y los datos de demo.

## Usuarios de demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `alvaro` | `demo123` | Usuario (vendedor demo) |
| `lucia` | `demo123` | Usuario |

Para resetear los datos de demo: ejecutar `backend/scripts/demo_data.sql` en MySQL.

## Qué incluye la app

- Registro e inicio de sesión
- Catálogo con búsqueda, filtros y paginación
- Subastas con pujas en vivo
- Chat y comentarios por producto
- Perfil, favoritos y mis pujas
- Panel `/admin` (solo administradores)

## Repositorio

https://github.com/alvaroooom/forbids-proyectointermodular

## Despliegue (Vercel + Railway)

Recomendado para cumplir el requisito de despliegue. En la defensa puedes usar **local**; online enseñas la URL de Vercel.

| Parte | Plataforma | Gratis |
|-------|------------|--------|
| Frontend React | [Vercel](https://vercel.com) | Sí |
| Backend Spring Boot | [Railway](https://railway.app) | Créditos mensuales |
| MySQL | Railway (add-on) | Incluido en el servicio |

### 1. Railway — MySQL + backend

1. Cuenta en Railway → **New Project** → **Deploy from GitHub** (este repo).
2. **Add service → MySQL**. Espera a que arranque.
3. **Add service → GitHub** otra vez, carpeta raíz: **`backend`** (Root Directory = `backend`).
4. En el servicio MySQL → **Connect** → copia variables (`MYSQLHOST`, `MYSQLPORT`, etc.).
5. Importa el esquema y datos:
   - Railway MySQL → pestaña **Data** / consola, o desde tu PC:
   ```bash
   mysql -h HOST -P PORT -u root -p railway < forbids.sql
   ```
6. Variables del servicio **backend** (Settings → Variables):

   | Variable | Valor |
   |----------|--------|
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=true&serverTimezone=UTC` |
   | `SPRING_DATASOURCE_USERNAME` | `${{MySQL.MYSQLUSER}}` |
   | `SPRING_DATASOURCE_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
   | `APP_JWT_SECRET` | Clave larga aleatoria (32+ caracteres) |
   | `APP_CORS_ALLOWED_ORIGINS` | `https://TU-PROYECTO.vercel.app` (la pondrás tras Vercel) |

7. **Generate domain** en Railway (ej. `forbids-api-production.up.railway.app`).
8. Comprueba: `https://TU-URL-RAILWAY/actuator/health` → `{"status":"UP"}`.

### 2. Vercel — frontend

1. [vercel.com](https://vercel.com) → **Import** del mismo repo GitHub.
2. Framework: **Vite** (detectado automático).
3. **Environment Variable:**
   - `VITE_API_BASE_URL` = `https://TU-URL-RAILWAY` (sin barra final).
4. Deploy. Copia la URL (ej. `https://forbids.vercel.app`).
5. Vuelve a Railway y actualiza `APP_CORS_ALLOWED_ORIGINS` con esa URL. Redeploy del backend.

### 3. Probar online

- Abre la URL de Vercel → registro/login → catálogo → puja.
- Si el backend estuvo parado, la primera petición puede tardar ~20–30 s (plan free).

### Notas

- Las **imágenes subidas al servidor** en Railway pueden perderse al reiniciar; en demo usa URLs externas.
- **Presentación en el instituto:** sigue usando `npm run dev` + `mvn spring-boot:run` en local (más estable para WebSocket en vivo).
- Archivos de despliegue: `vercel.json`, `backend/Dockerfile`, `backend/railway.toml`.
