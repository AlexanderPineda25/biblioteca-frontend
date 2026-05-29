# Biblioteca Frontend

Frontend de Biblioteca U construido con React, Vite, Tailwind CSS y Nginx para produccion.

Este directorio esta listo para publicarse como repositorio frontend independiente.

## Funcionalidades

- Login y registro.
- Rutas protegidas por JWT.
- Catalogo de libros con filtros.
- Panel admin para libros, usuarios y roles.
- Recomendador IA del catalogo.
- Widget flotante de chatbot IA conectado a `chatbot-service`.

## Variables de entorno

En desarrollo local crea `.env.local` dentro de `Biblioteca-Frontend`:

```env
VITE_AUTH_SERVICE_URL=http://localhost:5132
VITE_CATALOG_SERVICE_URL=http://localhost:3002
VITE_CHATBOT_SERVICE_URL=http://localhost:3003
```

En Docker estas variables se pasan como build args desde el `docker-compose.yml` raiz.

## Instalacion local

```powershell
npm install
npm run dev
```

La app queda en:

```text
http://localhost:5173
```

Para usarla en desarrollo, asegurate de que los servicios backend permitan CORS desde `http://localhost:5173`.

## Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

## Docker

Desde la raiz del proyecto:

```powershell
docker compose up -d --build frontend
```

Solo Docker:

```powershell
docker build `
  --build-arg VITE_AUTH_SERVICE_URL=http://localhost:5132 `
  --build-arg VITE_CATALOG_SERVICE_URL=http://localhost:3002 `
  --build-arg VITE_CHATBOT_SERVICE_URL=http://localhost:3003 `
  -t biblioteca-frontend:latest .

docker run -p 4173:80 biblioteca-frontend:latest
```

## Kubernetes y AKS

Documentacion del repo frontend:

- Despliegue y CI/CD: [DEPLOYMENT.md](DEPLOYMENT.md)

Manifiestos:

```text
k8s/base
k8s/overlays/aks
k8s/overlays/aks-no-domain
```

Validar render:

```powershell
kubectl kustomize k8s/overlays/aks-no-domain
```

Pipeline:

```text
.github/workflows/frontend-aks-ci-cd.yml
```

El pipeline despliega solo `biblioteca-frontend`, sin tocar backend.

Despliegue AKS verificado:

```text
http://52.158.169.2
ACR: acrbiblioalex25.azurecr.io
Imagen: biblioteca/frontend
```

## Estructura relevante

```text
src/
  api/
    auth.api.js
    catalog.api.js
    chatbot.api.js
  components/
    chatbot/ChatbotWidget.jsx
    common/
    books/
    roles/
  context/
  hooks/
  pages/
  utils/
```

## Widget de chatbot

`ChatbotWidget.jsx` aparece solo cuando el usuario esta autenticado. Envia mensajes a:

```text
POST /api/chatbot/messages
```

El cliente `chatbot.api.js` adjunta automaticamente el JWT desde `localStorage`.

El widget muestra:

- Mensajes del usuario.
- Respuestas IA.
- Estado de carga.
- Error de servicio si ocurre.
- Ultimo proveedor/modelo usado.

## Verificacion

```powershell
npm run lint
npm run build
npm audit --audit-level=high
```

La build de produccion se sirve con Nginx y `nginx.conf` redirige rutas SPA hacia `index.html`.
