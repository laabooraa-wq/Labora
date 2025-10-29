# Guía de Despliegue

## ✅ Lo Que Ya Está Hecho

He creado estos archivos para despliegue en Netlify:

1. **`netlify.toml`** - Configuración de build y redirects para SPA
2. **`public/_redirects`** - Reglas de redirección para rutas
3. **Toda la aplicación** está lista para producción

## 🚀 Pasos para Desplegar en Netlify

### 1. Configurar Variables de Entorno en Netlify

Ve a **Site settings → Environment variables** y agrega:

```
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_PROJECT_ID=tu_project_id_aqui
VITE_FIREBASE_APP_ID=tu_app_id_aqui
```

### 2. Configurar Firebase Console

Ve a [Firebase Console](https://console.firebase.google.com/):

1. Selecciona tu proyecto
2. **Authentication** → **Settings** → **Authorized domains**
3. Agrega tu dominio de Netlify:
   - Por ejemplo: `tu-app.netlify.app`
   - Netlify te da el dominio cuando despliegas

### 3. Redesplegar en Netlify

Después de agregar las variables de entorno:

1. Ve a **Deploys** en Netlify
2. Click en **Trigger deploy** → **Deploy site**

### 4. Verificar

1. Visita tu sitio: `https://tu-app.netlify.app`
2. Click en "Iniciar sesión con Google"
3. Deberías ver:
   - ✅ Redirige a Google
   - ✅ Redirige de vuelta a tu app
   - ✅ Te lleva al asistente de configuración (primera vez)
   - ✅ O al calendario (si ya configuraste tu perfil)

## 🔧 Si Aún Te Lleva a la Página de Bienvenida

Si después de iniciar sesión te vuelve a llevar a Welcome:

### Opción 1: Verificar Variables de Entorno

```bash
# En Netlify, verifica que las variables estén bien escritas
# Deben empezar con VITE_ para estar disponibles en el frontend
```

### Opción 2: Verificar Firebase Console

- Asegúrate de que el dominio de Netlify esté en **Authorized domains**
- Verifica que Google sign-in esté **habilitado**

### Opción 3: Limpiar Caché

En Netlify:
1. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

## 🏠 Despliegue Local

Para probar localmente:

```bash
# 1. Clonar el repo
git clone tu-repo.git
cd tu-repo

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cat > .env << EOF
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_APP_ID=tu_app_id
EOF

# 4. En Firebase Console, agregar localhost a authorized domains

# 5. Ejecutar
npm run dev
```

Visita: `http://localhost:5000`

## 📦 Build para Producción

```bash
npm run build
```

El build genera:
- `dist/public/` - Frontend (HTML, CSS, JS)
- Netlify usa esto automáticamente según `netlify.toml`

## ❓ Troubleshooting

### Error: "auth/configuration-not-found"
- ✅ Solución: Agrega el dominio a Firebase Authorized domains

### Error: Vuelve a Welcome después de login
- ✅ Verifica variables de entorno en Netlify (deben tener `VITE_` prefix)
- ✅ Limpia caché y redesplega
- ✅ Verifica que `netlify.toml` y `public/_redirects` estén en el repo

### Error: 404 en rutas
- ✅ Solución: Ya está resuelto con `netlify.toml` y `_redirects`

## 🎯 Checklist Final

- [ ] Variables de entorno configuradas en Netlify
- [ ] Dominio agregado a Firebase Authorized domains
- [ ] Google sign-in habilitado en Firebase
- [ ] `netlify.toml` y `public/_redirects` en el repo
- [ ] Desplegado en Netlify
- [ ] Probado el flujo completo de autenticación
