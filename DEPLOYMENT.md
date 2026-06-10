# Frontend — Despliegue y CI/CD

Este repositorio despliega el frontend React como contenedor Nginx en AKS.

---

## Requisitos

- AKS funcionando.
- ACR conectado al cluster.
- Backend desplegado o al menos un endpoint API publico.
- Ingress controller instalado.

---

## Variables de build

Vite inyecta URLs en tiempo de build. Para produccion con DuckDNS + SSL:

```env
VITE_AUTH_SERVICE_URL=https://bibliotechu.duckdns.org
VITE_CATALOG_SERVICE_URL=https://bibliotechu.duckdns.org
VITE_CHATBOT_SERVICE_URL=https://bibliotechu.duckdns.org
```

Sin dominio (IP directa):

```env
VITE_AUTH_SERVICE_URL=http://52.158.169.2
VITE_CATALOG_SERVICE_URL=http://52.158.169.2
VITE_CHATBOT_SERVICE_URL=http://52.158.169.2
```

Como el frontend es estatico, si cambian estas URLs debes reconstruir la imagen.

---

## Build y push manual

```powershell
$ACR="acrbibliotecaedu.azurecr.io"
$TAG="manual"

az acr login --name acrbibliotecaedu

docker build `
  --build-arg VITE_AUTH_SERVICE_URL="https://bibliotechu.duckdns.org" `
  --build-arg VITE_CATALOG_SERVICE_URL="https://bibliotechu.duckdns.org" `
  --build-arg VITE_CHATBOT_SERVICE_URL="https://bibliotechu.duckdns.org" `
  -t "$ACR/biblioteca/frontend:$TAG" .

docker push "$ACR/biblioteca/frontend:$TAG"
```

---

## Aplicar Kubernetes

Aplica el manifiesto ya renderizado con la imagen final. Esto evita rollouts intermedios con `latest` o imagenes placeholder.

```powershell
$ACR="acrbibliotecaedu.azurecr.io"
$TAG="aks-20260522-063426"

kubectl kustomize k8s/overlays/aks-no-domain |
  ForEach-Object {
    $_ -replace 'image: .*frontend:.*', "image: $ACR/biblioteca/frontend:$TAG"
  } |
  kubectl apply -f -

kubectl rollout status deployment/biblioteca-frontend -n biblioteca
```

---

## Verificacion

```powershell
kubectl get pods -n biblioteca -l app=biblioteca-frontend
kubectl get ingress -n biblioteca
kubectl logs deployment/biblioteca-frontend -n biblioteca --tail=50
Invoke-WebRequest -UseBasicParsing "https://bibliotechu.duckdns.org/"
```

Port-forward temporal:

```powershell
kubectl port-forward svc/biblioteca-frontend 4173:80 -n biblioteca
```

Abre: `http://localhost:4173`

---

## Despliegue independiente

Este repo puede desplegar solo el frontend sin reconstruir backend:

```powershell
kubectl set image deployment/biblioteca-frontend frontend="$ACR/biblioteca/frontend:$TAG" -n biblioteca
kubectl rollout status deployment/biblioteca-frontend -n biblioteca
```

Para redeploys completos se recomienda el metodo renderizado de la seccion anterior.

---

## CI/CD (GitHub Actions)

Pipeline:

```text
.github/workflows/frontend-aks-ci-cd.yml
```

### Que hace

1. Instala dependencias con `npm ci`.
2. Ejecuta `npm run lint`.
3. Ejecuta `npm run build`.
4. Renderiza Kubernetes con `kubectl kustomize`.
5. Valida que existan variables y secrets requeridos antes de tocar Azure.
6. Construye imagen Docker Nginx.
7. Publica en Azure Container Registry.
8. Renderiza los manifiestos con Kustomize y reemplaza la imagen por el tag `${{ github.sha }}`.
9. Aplica el manifiesto final en AKS sin rollout intermedio.

### Variables del repositorio

```text
AKS_RESOURCE_GROUP
AKS_CLUSTER_NAME
ACR_NAME
ACR_LOGIN_SERVER
VITE_AUTH_SERVICE_URL
VITE_CATALOG_SERVICE_URL
VITE_CHATBOT_SERVICE_URL
```

Para ingress unico de backend:

```text
VITE_AUTH_SERVICE_URL=http://52.158.169.2
VITE_CATALOG_SERVICE_URL=http://52.158.169.2
VITE_CHATBOT_SERVICE_URL=http://52.158.169.2
```

### Secrets del repositorio

```text
AZURE_CREDENTIALS
```

El workflow falla temprano si falta cualquiera de estos valores criticos:

```text
AKS_RESOURCE_GROUP
AKS_CLUSTER_NAME
ACR_NAME
ACR_LOGIN_SERVER
AZURE_CREDENTIALS
```

### Configuracion de GitHub Actions

En GitHub ve a:

```text
Settings > Secrets and variables > Actions
```

Variables requeridas:

```text
AKS_RESOURCE_GROUP=rg-biblioteca-aks-edu
AKS_CLUSTER_NAME=aks-biblioteca-edu
ACR_NAME=acrbibliotecaedu
ACR_LOGIN_SERVER=acrbibliotecaedu.azurecr.io
PUBLIC_BASE_URL=http://52.158.169.2
VITE_AUTH_SERVICE_URL=http://52.158.169.2
VITE_CATALOG_SERVICE_URL=http://52.158.169.2
VITE_CHATBOT_SERVICE_URL=http://52.158.169.2
```

Secret requerido:

```text
AZURE_CREDENTIALS
```

Si instalas GitHub CLI:

```powershell
winget install GitHub.cli
gh auth login

gh variable set AKS_RESOURCE_GROUP --body "rg-biblioteca-aks-edu"
gh variable set AKS_CLUSTER_NAME --body "aks-biblioteca-edu"
gh variable set ACR_NAME --body "acrbibliotecaedu"
gh variable set ACR_LOGIN_SERVER --body "acrbibliotecaedu.azurecr.io"
gh variable set PUBLIC_BASE_URL --body "http://52.158.169.2"
gh variable set VITE_AUTH_SERVICE_URL --body "http://52.158.169.2"
gh variable set VITE_CATALOG_SERVICE_URL --body "http://52.158.169.2"
gh variable set VITE_CHATBOT_SERVICE_URL --body "http://52.158.169.2"
```

### Por que se renderiza antes de aplicar

El manifiesto final se genera en `/tmp/frontend-rendered.yaml` con la imagen exacta de la ejecucion. Asi se evita aplicar primero una imagen `latest` y luego cambiarla, reduciendo rollouts y consumo temporal de CPU en el nodo `Standard_D2s_v3`.

---

## Troubleshooting

```powershell
# Ver logs de un pod especifico
kubectl logs -n biblioteca deployment/biblioteca-frontend

# Ver estado de todos los servicios
kubectl get all -n biblioteca

# Describir un pod para ver eventos
kubectl describe pod <pod-name> -n biblioteca

# Acceder a shell de un pod
kubectl exec -it <pod-name> -n biblioteca -- /bin/bash
```
