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

Para la demo actual sin dominio:

```env
VITE_AUTH_SERVICE_URL=http://52.158.169.2
VITE_CATALOG_SERVICE_URL=http://52.158.169.2
VITE_CHATBOT_SERVICE_URL=http://52.158.169.2
```

Como el frontend es estatico, si cambian estas URLs debes reconstruir la imagen.

## Build y push manual

```powershell
$ACR="acrbiblioalex25.azurecr.io"
$TAG="manual"

az acr login --name acrbiblioalex25

docker build `
  --build-arg VITE_AUTH_SERVICE_URL="http://52.158.169.2" `
  --build-arg VITE_CATALOG_SERVICE_URL="http://52.158.169.2" `
  --build-arg VITE_CHATBOT_SERVICE_URL="http://52.158.169.2" `
  -t "$ACR/biblioteca/frontend:$TAG" .

docker push "$ACR/biblioteca/frontend:$TAG"
```

## Aplicar Kubernetes

Aplica el manifiesto ya renderizado con la imagen final. Esto evita rollouts intermedios con `latest` o imagenes placeholder.

```powershell
$ACR="acrbiblioalex25.azurecr.io"
$TAG="aks-20260522-063426"

kubectl kustomize k8s/overlays/aks-no-domain |
  ForEach-Object {
    $_ -replace 'image: .*frontend:.*', "image: $ACR/biblioteca/frontend:$TAG"
  } |
  kubectl apply -f -

kubectl rollout status deployment/biblioteca-frontend -n biblioteca
```

## Verificacion

```powershell
kubectl get pods -n biblioteca -l app=biblioteca-frontend
kubectl get ingress -n biblioteca
kubectl logs deployment/biblioteca-frontend -n biblioteca --tail=50
Invoke-WebRequest -UseBasicParsing "http://52.158.169.2/"
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
kubectl set image deployment/biblioteca-frontend frontend="$ACR/biblioteca/frontend:$TAG" -n biblioteca
kubectl rollout status deployment/biblioteca-frontend -n biblioteca
```

Para redeploys completos se recomienda el metodo renderizado de la seccion anterior.

## CI/CD

El workflow `.github/workflows/frontend-aks-ci-cd.yml` escucha `main` y `master`, usa el overlay `k8s/overlays/aks-no-domain` y publica la imagen como `ACR_LOGIN_SERVER/biblioteca/frontend:<sha>`.

Variables requeridas en GitHub:

```text
AKS_RESOURCE_GROUP=rg-biblioteca-aks-edu
AKS_CLUSTER_NAME=aks-biblioteca-edu
ACR_NAME=acrbiblioalex25
ACR_LOGIN_SERVER=acrbiblioalex25.azurecr.io
VITE_AUTH_SERVICE_URL=http://52.158.169.2
VITE_CATALOG_SERVICE_URL=http://52.158.169.2
VITE_CHATBOT_SERVICE_URL=http://52.158.169.2
```

Secret requerido:

```text
AZURE_CREDENTIALS
```

El workflow valida `AKS_RESOURCE_GROUP`, `AKS_CLUSTER_NAME`, `ACR_NAME`, `ACR_LOGIN_SERVER` y `AZURE_CREDENTIALS` antes de hacer login en Azure.
