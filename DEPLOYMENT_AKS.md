# Frontend AKS deployment guide

Este repositorio despliega el frontend React como contenedor Nginx en AKS.

## Requisitos

- AKS funcionando.
- ACR conectado al cluster.
- Backend desplegado o al menos un endpoint API publico.
- Ingress controller instalado.

## Variables de build

Vite inyecta URLs en tiempo de build:

```env
VITE_AUTH_SERVICE_URL=https://api.biblioteca.example.com
VITE_CATALOG_SERVICE_URL=https://api.biblioteca.example.com
VITE_CHATBOT_SERVICE_URL=https://api.biblioteca.example.com
```

Como el frontend es estatico, si cambian estas URLs debes reconstruir la imagen.

## Build y push manual

```powershell
$ACR="acrbibliotecaedu123.azurecr.io"
$TAG="manual"

az acr login --name acrbibliotecaedu123

docker build `
  --build-arg VITE_AUTH_SERVICE_URL="https://api.biblioteca.example.com" `
  --build-arg VITE_CATALOG_SERVICE_URL="https://api.biblioteca.example.com" `
  --build-arg VITE_CHATBOT_SERVICE_URL="https://api.biblioteca.example.com" `
  -t "$ACR/biblioteca-frontend:$TAG" .

docker push "$ACR/biblioteca-frontend:$TAG"
```

## Aplicar Kubernetes

```powershell
kubectl apply -k k8s/overlays/aks

kubectl set image deployment/biblioteca-frontend `
  frontend="$ACR/biblioteca-frontend:$TAG" `
  -n biblioteca

kubectl rollout status deployment/biblioteca-frontend -n biblioteca
```

## Verificacion

```powershell
kubectl get pods -n biblioteca -l app=biblioteca-frontend
kubectl get ingress -n biblioteca
kubectl logs deployment/biblioteca-frontend -n biblioteca --tail=50
```

Port-forward temporal:

```powershell
kubectl port-forward svc/biblioteca-frontend 4173:80 -n biblioteca
```

Abre:

```text
http://localhost:4173
```

## Despliegue independiente

Este repo puede desplegar solo el frontend sin reconstruir backend:

```powershell
kubectl set image deployment/biblioteca-frontend frontend="$ACR/biblioteca-frontend:$TAG" -n biblioteca
```
