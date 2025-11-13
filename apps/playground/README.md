# DeonPay Elements - Documentación Interactiva

Una documentación interactiva completa y espectacular para DeonPay Elements SDK. Diseñada para facilitar la integración de pagos seguros en aplicaciones web.

## Características

- **Demo Interactiva**: Experimenta con el SDK en tiempo real
- **Guía de Integración**: Wizard paso a paso con código completo
- **Personalización Avanzada**: Editor de temas y estilos en vivo
- **Ejemplos Multi-Framework**: React, Next.js, Vue, Angular y Vanilla JS
- **Configuración Avanzada**: Webhooks, 3DS, validaciones y más
- **Diseño Moderno**: UI/UX profesional con animaciones suaves
- **Dark Mode**: Soporte completo para modo oscuro
- **Responsive**: Optimizado para todos los dispositivos
- **Accesible**: Cumple con estándares WCAG AA

## Estructura del Proyecto

```
apps/playground/
├── app/
│   ├── components/
│   │   ├── ui/                    # Componentes UI reutilizables
│   │   │   ├── CodeBlock.tsx     # Bloques de código con copy-paste
│   │   │   ├── StepCard.tsx      # Cards para wizard de pasos
│   │   │   ├── ThemeCard.tsx     # Preview de temas
│   │   │   └── ColorPicker.tsx   # Selector de colores
│   │   ├── sections/              # Secciones de contenido
│   │   │   ├── DemoSection.tsx          # Demo interactiva
│   │   │   ├── IntegrationGuide.tsx     # Guía paso a paso
│   │   │   ├── CustomizationSection.tsx # Personalización
│   │   │   ├── CodeExamples.tsx         # Ejemplos multi-framework
│   │   │   └── AdvancedConfig.tsx       # Configuración avanzada
│   │   ├── Hero.tsx               # Hero section principal
│   │   ├── TabNavigation.tsx      # Navegación entre secciones
│   │   └── PaymentDemo.tsx        # Demo funcional de pagos
│   ├── globals.css                # Estilos globales y animaciones
│   ├── layout.tsx                 # Layout con SEO mejorado
│   └── page.tsx                   # Página principal
├── package.json
├── tailwind.config.js
└── README.md
```

## Tecnologías Utilizadas

- **Next.js 15**: Framework React con App Router
- **React 18**: Biblioteca UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **DeonPay Elements SDK**: SDK de pagos

## Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+
- npm, yarn o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/deonpay/deonpay-elements.git

# Navegar al playground
cd deonpay-elements/apps/playground

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo en puerto 3001
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3001](http://localhost:3001) en tu navegador.

### Build para Producción

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start
```

## Cambios Realizados

### 1. Eliminación de Referencias a "Stripe"

- Renombrado de tema "stripe" → "classic"
- Actualización de tipos TypeScript
- Cambio de nombres de variables y comentarios

### 2. Mejoras Visuales de Temas

Los 3 temas ahora son claramente diferenciados:

- **Flat**: Diseño moderno, minimalista, colores planos
- **Classic**: Estilo profesional con bordes y sombras definidas
- **Dark**: Modo oscuro elegante con colores vibrantes

### 3. Estructura de Documentación Interactiva

#### Hero Section
- Título impactante con gradientes animados
- Badges animados con estado "live"
- CTAs prominentes con iconos
- Stats section con métricas clave

#### Tab Navigation
- Navegación sticky con 5 tabs principales
- Indicadores visuales de tab activo
- Iconos descriptivos para cada sección
- Responsive y accesible

#### Sección: Demo Interactiva
- Formulario de pago funcional en tiempo real
- Selector visual de 3 temas con previews
- Panel de customización con:
  - Color picker para color primario
  - Sliders para border radius y font size
  - Preview en tiempo real de cambios
  - Código generado automáticamente

#### Sección: Guía de Integración
- Wizard de 6 pasos numerados
- Progress bar visual
- Código completo para cada paso:
  1. Instalación del SDK
  2. Configuración inicial
  3. Crear Payment Intent (Backend)
  4. Montar formulario (Frontend)
  5. Procesar el pago
  6. Configurar webhooks
- Navegación entre pasos
- Links a recursos adicionales

#### Sección: Personalización
- Cards de temas predefinidos con descripciones
- Tabla completa de variables CSS disponibles
- Ejemplo de tema personalizado
- Configuración avanzada con rules
- Ejemplos de sobrescritura con CSS global

#### Sección: Ejemplos de Código
- Tabs para 5 frameworks diferentes:
  - React
  - Next.js (con App Router)
  - Vue 3 (Composition API)
  - Vanilla JavaScript
  - Angular
- Código completo y funcional para cada uno
- Botón de copy en todos los bloques
- Notas importantes y mejores prácticas

#### Sección: Configuración Avanzada
- Validaciones personalizadas
- Manejo completo de errores
- Configuración de 3D Secure
- Tarjetas de prueba categorizadas:
  - Pagos exitosos
  - Pagos declinados
  - 3DS
  - Internacionales
- Implementación de webhooks seguros
- Mejores prácticas en 4 categorías:
  - Seguridad
  - Performance
  - UX
  - Testing

### 4. Componentes UI Creados

#### CodeBlock
- Syntax highlighting visual
- Botón de copiar con feedback
- Line numbers opcionales
- Scroll horizontal/vertical
- Título y lenguaje
- Altura máxima configurable
- Animación al copiar

#### StepCard
- Badge numerado animado
- Estados activo/inactivo
- Contenido expandible
- Navegación entre pasos
- Animaciones suaves

#### ThemeCard
- Preview visual del tema
- Badge de "Seleccionado"
- Hover effects
- Descripción del tema
- Click para seleccionar

#### ColorPicker
- Selector visual de color
- Input hex manual
- HTML color picker nativo
- Colores predefinidos (10)
- Dropdown animado
- Feedback visual de selección

### 5. Mejoras de Diseño y UX

#### Estilos Globales (globals.css)
- Animaciones custom:
  - fade-in
  - slide-up
  - slide-in-left
  - pulse-slow
  - gradient-shift
- Animation delays (200ms, 400ms, 600ms, 800ms)
- Scrollbar personalizada (light/dark)
- Mejoras de accesibilidad:
  - Reduced motion support
  - Focus visible mejorado
  - Selección de texto custom

#### Layout
- Metadata SEO completa
- Open Graph tags
- Twitter cards
- Keywords relevantes
- Theme color por esquema
- Preconnect a API
- Favicon y resources

#### Hero Section
- Gradientes animados
- Badges con pulse animation
- CTAs con hover effects
- Stats cards con glassmorphism
- Responsive y accesible

#### Footer
- 4 columnas de información
- Links a recursos
- Social media icons
- Copyright y legal links
- Botón "Back to top"

### 6. Características Interactivas

- **Live Preview**: Cambios en tiempo real en demo
- **Copy to Clipboard**: En todos los bloques de código
- **Theme Switcher**: Cambio instantáneo de temas
- **Live Customization**: Color, radius, font size
- **Collapsible Sections**: Para código largo (scroll)
- **Progress Tracking**: En wizard de integración
- **Smooth Scrolling**: Entre secciones
- **Keyboard Navigation**: Accesibilidad completa

### 7. Performance y Accesibilidad

- **Lazy Loading**: Ready para implementar
- **Code Splitting**: Por sección
- **Semantic HTML**: Tags apropiados
- **ARIA Labels**: En elementos interactivos
- **Keyboard Support**: Tab navigation completo
- **Screen Reader**: Texto alternativo
- **Reduced Motion**: Respeta preferencias
- **Focus Management**: Indicadores claros

### 8. Responsive Design

- **Mobile First**: Optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid Adaptativo**: 1-4 columnas
- **Touch Friendly**: Botones grandes
- **Scroll Horizontal**: En tabs y tablas
- **Viewport Meta**: Configurado
- **Font Scaling**: Responsive

## Configuración de API

Para usar el demo funcional, necesitas configurar tus credenciales:

1. Obtén tu API key en [dashboard.deonpay.mx](https://dashboard.deonpay.mx)
2. Reemplaza `pk_test_demo_key` en los componentes con tu key pública
3. Configura el endpoint backend para crear Payment Intents

## Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_DEONPAY_KEY=pk_tu_api_key_publica
DEONPAY_SECRET_KEY=sk_tu_api_key_secreta
```

## Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Otros Proveedores

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## Mejoras Futuras Sugeridas

### Funcionalidad
- [ ] Modo de código inline editable (CodeSandbox style)
- [ ] Buscador de documentación con Algolia
- [ ] Versiones de documentación (v1, v2, etc.)
- [ ] Modo comparison (antes/después de personalización)
- [ ] Export de configuración como JSON
- [ ] Playground guardado en localStorage
- [ ] Share links para configuraciones personalizadas

### Contenido
- [ ] Video tutoriales embebidos
- [ ] Casos de uso por industria (ecommerce, SaaS, etc.)
- [ ] Guía de migración desde otros providers
- [ ] Troubleshooting section con FAQs
- [ ] Changelog interactivo
- [ ] Blog de mejores prácticas

### UI/UX
- [ ] Dark mode toggle manual
- [ ] Animaciones más elaboradas con Framer Motion
- [ ] Cursor personalizado
- [ ] Parallax effects sutiles
- [ ] Micro-interacciones mejoradas
- [ ] Skeleton loaders
- [ ] Toast notifications para feedback

### Technical
- [ ] Tests unitarios (Jest + React Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] Performance monitoring (Web Vitals)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] A/B testing framework
- [ ] i18n para múltiples idiomas

## Soporte

- Documentación: [docs.deonpay.mx](https://docs.deonpay.mx)
- Email: support@deonpay.mx
- GitHub Issues: [github.com/deonpay/elements](https://github.com/deonpay/elements)

## Licencia

MIT License - DeonPay 2024

---

Hecho con ❤️ por el equipo de DeonPay
