# Frontend CI/CD

Pipeline:

```text
.github/workflows/frontend-aks-ci-cd.yml
```

## Que hace

1. Instala dependencias con `npm ci`.
2. Ejecuta `npm run lint`.
3. Ejecuta `npm run build`.
4. Renderiza Kubernetes con `kubectl kustomize`.
5. Valida que existan variables y secrets requeridos antes de tocar Azure.
6. Construye imagen Docker Nginx.
7. Publica en Azure Container Registry.
8. Renderiza los manifiestos con Kustomize y reemplaza la imagen por el tag `${{ github.sha }}`.
9. Aplica el manifiesto final en AKS sin rollout intermedio.

## Variables del repositorio

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

## Secrets del repositorio

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

## Despliegue por repo separado

Este workflow esta dentro de `Biblioteca-Frontend/.github/workflows`. Cuando publiques esta carpeta como repo independiente, GitHub Actions lo detectara automaticamente.

El workflow escucha pushes a `main` y `master`, usa `k8s/overlays/aks-no-domain` para demo sin DNS, y publica la imagen como `ACR_LOGIN_SERVER/biblioteca/frontend:<sha>`.

## Configuracion de GitHub Actions

En GitHub ve a:

```text
Settings > Secrets and variables > Actions
```

Variables requeridas:

```text
AKS_RESOURCE_GROUP=rg-biblioteca-aks-edu
AKS_CLUSTER_NAME=aks-biblioteca-edu
ACR_NAME=acrbiblioalex25
ACR_LOGIN_SERVER=acrbiblioalex25.azurecr.io
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
gh variable set ACR_NAME --body "acrbiblioalex25"
gh variable set ACR_LOGIN_SERVER --body "acrbiblioalex25.azurecr.io"
gh variable set PUBLIC_BASE_URL --body "http://52.158.169.2"
gh variable set VITE_AUTH_SERVICE_URL --body "http://52.158.169.2"
gh variable set VITE_CATALOG_SERVICE_URL --body "http://52.158.169.2"
gh variable set VITE_CHATBOT_SERVICE_URL --body "http://52.158.169.2"
```

## Por que se renderiza antes de aplicar

El manifiesto final se genera en `/tmp/frontend-rendered.yaml` con la imagen exacta de la ejecucion. Asi se evita aplicar primero una imagen `latest` y luego cambiarla, reduciendo rollouts y consumo temporal de CPU en el nodo `Standard_D2s_v3`.

## Redeploy manual

Usa el mismo patron de manifiesto renderizado:

```powershell
$ACR="acrbiblioalex25.azurecr.io"
$TAG="aks-20260522-063426"

kubectl kustomize k8s/overlays/aks-no-domain |
  ForEach-Object {
    $_ -replace 'image: .*frontend:.*', "image: $ACR/biblioteca/frontend:$TAG"
  } |
  kubectl apply -f -

kubectl rollout status deployment/biblioteca-frontend -n biblioteca --timeout=180s
```
