# Freelancer OS Pro v1.0

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)

Dashboard web completo para gestión de clientes, proyectos,
facturas y contratos para freelancers.

## 📦 Características
- ✅ Gestión de clientes
- ✅ Proyectos y tareas
- ✅ Facturación profesional
- ✅ Contratos digitales
- ✅ Integración con Stripe
- ✅ Dashboard con métricas
- ✅ Modo oscuro/claro
- ✅ 100% responsive

## 🛠️ Stack
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** PostgreSQL + Prisma ORM
- **Autenticación:** NextAuth.js
- **Pagos:** Stripe

## ⚡ Instalación rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/tenderoalbertalberto-rgb/freelancer-os-pro.git
cd freelancer-os-pro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Configurar base de datos
npx prisma migrate dev
npx prisma db seed

# 5. Ejecutar en desarrollo
npm run dev

# 6. Abrir http://localhost:3000
```