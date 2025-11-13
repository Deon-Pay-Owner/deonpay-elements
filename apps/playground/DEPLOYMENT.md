# Deployment Guide - DeonPay Elements Playground

Guía completa para desplegar el playground en diferentes plataformas.

---

## Pre-requisitos

Antes de desplegar, asegúrate de:

1. ✅ El proyecto se construye sin errores localmente
2. ✅ Todas las variables de entorno están configuradas
3. ✅ Has testeado la aplicación en local
4. ✅ Tienes una cuenta en la plataforma de deployment

---

## Opción 1: Vercel (Recomendado)

### Por qué Vercel
- Integración nativa con Next.js
- Zero-config deployment
- Automatic HTTPS
- Edge network global
- Preview deployments automáticos
- Analytics integrado

### Setup Inicial

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Configurar Variables de Entorno**

Crea archivo `.env.production`:
```env
NEXT_PUBLIC_DEONPAY_KEY=pk_live_your_key_here
```

4. **Deploy**
```bash
# Desde el directorio playground
cd apps/playground

# Deploy a producción
vercel --prod
```

### Configuración en Dashboard

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Encuentra tu proyecto
3. Settings → Environment Variables
4. Añade:
   - `NEXT_PUBLIC_DEONPAY_KEY` (Production)
   - Cualquier otra variable necesaria

### Custom Domain

1. Settings → Domains
2. Add Domain: `elements.deonpay.mx`
3. Configurar DNS:
   ```
   Type: CNAME
   Name: elements
   Value: cname.vercel-dns.com
   ```
4. Esperar propagación (5-60 min)

### Configuración de Vercel (vercel.json)

```json
{
  "buildCommand": "cd ../.. && turbo run build --filter=@deonpay/playground",
  "devCommand": "next dev -p 3001",
  "framework": "nextjs",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_DEONPAY_KEY": "@deonpay-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/docs",
      "destination": "https://docs.deonpay.mx",
      "permanent": true
    }
  ]
}
```

---

## Opción 2: Netlify

### Setup

1. **Instalar Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Configurar netlify.toml**
```toml
[build]
  command = "cd ../.. && turbo run build --filter=@deonpay/playground"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

4. **Deploy**
```bash
netlify deploy --prod
```

---

## Opción 3: AWS Amplify

### Setup via Console

1. Login a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. New App → Host web app
3. Connect repository (GitHub)
4. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - cd apps/playground
        - npm run build
  artifacts:
    baseDirectory: apps/playground/.next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. Deploy

### Custom Domain
- Domain management → Add domain
- Follow verification steps

---

## Opción 4: Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  playground:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_DEONPAY_KEY=${NEXT_PUBLIC_DEONPAY_KEY}
    restart: unless-stopped
```

### Build y Run

```bash
# Build
docker build -t deonpay-playground .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_DEONPAY_KEY=pk_your_key \
  deonpay-playground

# Con docker-compose
docker-compose up -d
```

---

## Opción 5: Google Cloud Run

### Setup

1. **Instalar gcloud CLI**
```bash
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
```

2. **Login y configurar proyecto**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. **Build y Deploy**
```bash
# Build imagen
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/playground

# Deploy
gcloud run deploy playground \
  --image gcr.io/YOUR_PROJECT_ID/playground \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_DEONPAY_KEY=pk_your_key
```

---

## Opción 6: Railway

### Setup

1. **Instalar Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Inicializar y Deploy**
```bash
railway init
railway up
```

4. **Configurar Variables**
```bash
railway variables set NEXT_PUBLIC_DEONPAY_KEY=pk_your_key
```

### railway.json

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## CI/CD con GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
    paths:
      - 'apps/playground/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_DEONPAY_KEY: ${{ secrets.NEXT_PUBLIC_DEONPAY_KEY }}

      - name: Run tests
        run: npm test

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./apps/playground
```

---

## Post-Deployment Checklist

### Verificación Funcional
- [ ] Homepage carga correctamente
- [ ] Todas las tabs funcionan
- [ ] Demo de pago se monta
- [ ] Code blocks tienen botón de copiar
- [ ] Links externos funcionan
- [ ] Formularios funcionan
- [ ] Responsive funciona en mobile

### Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1

### SEO
- [ ] Meta tags presentes
- [ ] Open Graph tags funcionan
- [ ] Sitemap accesible
- [ ] robots.txt configurado

### Security
- [ ] HTTPS habilitado
- [ ] Security headers configurados
- [ ] API keys no expuestas
- [ ] CORS configurado correctamente

### Monitoring
- [ ] Analytics configurado
- [ ] Error tracking activo
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## Rollback

### Vercel
```bash
# Listar deployments
vercel ls

# Rollback a deployment anterior
vercel rollback [deployment-url]
```

### Netlify
```bash
# Listar deployments
netlify deploy:list

# Rollback
netlify rollback [deploy-id]
```

### Docker
```bash
# Pull versión anterior
docker pull deonpay-playground:previous-tag

# Restart con versión anterior
docker-compose up -d
```

---

## Troubleshooting

### Build Failures

**Error: Module not found**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: Out of memory**
```bash
# Aumentar memoria de Node
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Runtime Errors

**Error: API calls failing**
- Verificar variables de entorno
- Verificar CORS settings
- Verificar API keys

**Error: 404 en rutas**
- Verificar rewrites/redirects config
- Verificar build output
- Verificar server routing

### Performance Issues

**Slow loading**
- Habilitar caching
- Optimizar imágenes
- Enable CDN
- Minimize bundle size

---

## Monitoreo

### Herramientas Recomendadas

1. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

2. **Performance**
   - Google PageSpeed Insights
   - WebPageTest
   - Lighthouse CI

3. **Errors**
   - Sentry
   - LogRocket
   - Rollbar

4. **Analytics**
   - Google Analytics
   - Plausible (privacy-focused)
   - Vercel Analytics

---

## Backup y Recovery

### Automated Backups

**Base de datos** (si aplica)
```bash
# Backup daily
0 2 * * * pg_dump dbname > backup-$(date +\%Y\%m\%d).sql
```

**Repository**
- Mantener backups en GitHub
- Tags para releases importantes
- Branches protegidos

### Recovery Plan

1. Identificar issue
2. Rollback a última versión estable
3. Investigar causa raíz
4. Fix y redeploy
5. Documentar incident

---

## Maintenance Mode

Para mantenimiento programado:

1. Crear página de mantenimiento
2. Setup redirect temporal
3. Comunicar a usuarios
4. Realizar mantenimiento
5. Restaurar servicio
6. Verificar funcionalidad

---

## Contacto y Soporte

**DevOps Team**: devops@deonpay.mx
**Emergency**: +52 XXX XXX XXXX
**Status Page**: https://status.deonpay.mx

---

## Changelog de Deployments

Mantener log de deployments:

```markdown
## 2025-11-13 - v2.0.0
- Deploy inicial de nueva documentación
- Features: Demo interactiva, guías, ejemplos
- Environment: Production
- Deploy time: 14:30 UTC
- Status: ✅ Success
```

---

**¡Buena suerte con tu deployment!** 🚀
