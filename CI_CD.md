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
5. Construye imagen Docker Nginx.
6. Publica en Azure Container Registry.
7. Aplica manifiestos AKS.
8. Actualiza solo el deployment `biblioteca-frontend`.

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

## Despliegue por repo separado

Este workflow esta dentro de `Biblioteca-Frontend/.github/workflows`. Cuando publiques esta carpeta como repo independiente, GitHub Actions lo detectara automaticamente.

El workflow escucha pushes a `main` y `master`, usa `k8s/overlays/aks-no-domain` para demo sin DNS, y publica la imagen como `ACR_LOGIN_SERVER/biblioteca/frontend:<sha>`.
