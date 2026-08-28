// ========================================================================
// Freelancer OS Pro - Seed Data (Datos Demo)
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

import { PrismaClient, Role, ClientStatus, ProjectStatus, TaskStatus, TaskPriority, InvoiceStatus, ContractStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos demo...');

  // ------------------------------------------------------------------
  // 1. Crear usuario Admin demo
  // ------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Usuario admin creado: ${adminUser.email}`);

  // ------------------------------------------------------------------
  // 2. Crear clientes demo
  // ------------------------------------------------------------------
  const client1 = await prisma.client.create({
    data: {
      name: 'TechCorp Solutions',
      email: 'contacto@techcorp.com',
      phone: '+1 555-0101',
      company: 'TechCorp Solutions Inc.',
      address: '123 Innovation Drive',
      city: 'San Francisco',
      country: 'USA',
      taxId: 'US-123456789',
      status: ClientStatus.ACTIVE,
      userId: adminUser.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'María González',
      email: 'maria@designstudio.com',
      phone: '+34 612-345-678',
      company: 'Design Studio MG',
      city: 'Madrid',
      country: 'España',
      taxId: 'ES-12345678A',
      status: ClientStatus.ACTIVE,
      userId: adminUser.id,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'StartupXYZ',
      email: 'hello@startupxyz.io',
      company: 'StartupXYZ',
      city: 'Remote',
      country: 'Global',
      status: ClientStatus.ACTIVE,
      userId: adminUser.id,
    },
  });

  console.log(`✅ 3 clientes creados`);

  // ------------------------------------------------------------------
  // 3. Crear proyectos demo
  // ------------------------------------------------------------------
  const project1 = await prisma.project.create({
    data: {
      name: 'Rediseño Web E-commerce',
      description: 'Rediseño completo del sitio web de TechCorp con nuevo branding y optimización SEO.',
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
      budget: 8500,
      currency: 'USD',
      userId: adminUser.id,
      clientId: client1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'App Móvil iOS',
      description: 'Desarrollo de aplicación iOS para gestión de inventario.',
      status: ProjectStatus.PLANNING,
      startDate: new Date('2026-09-15'),
      endDate: new Date('2026-12-15'),
      budget: 12000,
      currency: 'USD',
      userId: adminUser.id,
      clientId: client2.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Landing Page MVP',
      description: 'Landing page para lanzamiento de producto SaaS.',
      status: ProjectStatus.COMPLETED,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-07-15'),
      budget: 2500,
      currency: 'USD',
      userId: adminUser.id,
      clientId: client3.id,
    },
  });

  console.log(`✅ 3 proyectos creados`);

  // ------------------------------------------------------------------
  // 4. Crear tareas demo
  // ------------------------------------------------------------------
  await prisma.task.createMany({
    data: [
      {
        title: 'Diseñar wireframes homepage',
        description: 'Crear wireframes de baja fidelidad para la página principal',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-08-15'),
        projectId: project1.id,
      },
      {
        title: 'Implementar sistema de pagos',
        description: 'Integrar Stripe para procesamiento de pagos',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.URGENT,
        dueDate: new Date('2026-09-01'),
        projectId: project1.id,
      },
      {
        title: 'Optimizar SEO on-page',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date('2026-09-15'),
        projectId: project1.id,
      },
      {
        title: 'Configurar entorno de desarrollo',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        projectId: project2.id,
      },
      {
        title: 'Diseñar UI/UX de la app',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-10-01'),
        projectId: project2.id,
      },
    ],
  });

  console.log(`✅ 5 tareas creadas`);

  // ------------------------------------------------------------------
  // 5. Crear facturas demo
  // ------------------------------------------------------------------
  const invoice1 = await prisma.invoice.create({
    data: {
      number: 'INV-2026-001',
      issueDate: new Date('2026-08-01'),
      dueDate: new Date('2026-08-31'),
      status: InvoiceStatus.PAID,
      subtotal: 2500,
      taxRate: 21,
      taxAmount: 525,
      total: 3025,
      currency: 'USD',
      notes: 'Pago por fase 1 del proyecto',
      userId: adminUser.id,
      clientId: client1.id,
      projectId: project1.id,
    },
  });

  await prisma.invoiceItem.createMany({
    data: [
      {
        description: 'Diseño UI/UX - Fase 1',
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
        invoiceId: invoice1.id,
      },
      {
        description: 'Desarrollo Frontend - Fase 1',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
        invoiceId: invoice1.id,
      },
    ],
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      number: 'INV-2026-002',
      issueDate: new Date('2026-08-15'),
      dueDate: new Date('2026-09-15'),
      status: InvoiceStatus.SENT,
      subtotal: 4000,
      taxRate: 21,
      taxAmount: 840,
      total: 4840,
      currency: 'USD',
      notes: 'Pago por fase 2 del proyecto',
      userId: adminUser.id,
      clientId: client1.id,
      projectId: project1.id,
    },
  });

  await prisma.invoiceItem.createMany({
    data: [
      {
        description: 'Desarrollo Backend - Fase 2',
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
        invoiceId: invoice2.id,
      },
      {
        description: 'Integración API de pagos',
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
        invoiceId: invoice2.id,
      },
    ],
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      number: 'INV-2026-003',
      issueDate: new Date('2026-07-15'),
      dueDate: new Date('2026-08-15'),
      status: InvoiceStatus.OVERDUE,
      subtotal: 2500,
      taxRate: 21,
      taxAmount: 525,
      total: 3025,
      currency: 'USD',
      notes: '⚠️ Pago vencido - enviar recordatorio',
      userId: adminUser.id,
      clientId: client3.id,
      projectId: project3.id,
    },
  });

  await prisma.invoiceItem.createMany({
    data: [
      {
        description: 'Landing Page completa',
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
        invoiceId: invoice3.id,
      },
    ],
  });

  console.log(`✅ 3 facturas creadas con items`);

  // ------------------------------------------------------------------
  // 6. Crear contratos demo
  // ------------------------------------------------------------------
  await prisma.contract.createMany({
    data: [
      {
        title: 'Contrato de Servicios - TechCorp',
        content: '# Contrato de Servicios Profesionales\n\nEntre [Freelancer] y TechCorp Solutions Inc.\n\n## Alcance del trabajo\n- Rediseño completo del sitio web\n- Optimización SEO\n- Integración de sistema de pagos\n\n## Duración: 3 meses\n## Valor: $8,500 USD',
        status: ContractStatus.SIGNED,
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-10-31'),
        value: 8500,
        currency: 'USD',
        signedAt: new Date('2026-07-28'),
        userId: adminUser.id,
        clientId: client1.id,
        projectId: project1.id,
      },
      {
        title: 'Contrato App iOS - Design Studio MG',
        content: '# Contrato de Desarrollo de Aplicación iOS\n\nDesarrollo de aplicación móvil para gestión de inventario.\n\n## Entregables\n- App iOS nativa\n- Panel de administración web\n- Documentación técnica\n\n## Duración: 3 meses\n## Valor: $12,000 USD',
        status: ContractStatus.SENT,
        startDate: new Date('2026-09-15'),
        endDate: new Date('2026-12-15'),
        value: 12000,
        currency: 'USD',
        userId: adminUser.id,
        clientId: client2.id,
        projectId: project2.id,
      },
    ],
  });

  console.log(`✅ 2 contratos creados`);

  // ------------------------------------------------------------------
  // Resumen final
  // ------------------------------------------------------------------
  console.log('\n🎉 Seed completado exitosamente!');
  console.log('📊 Resumen:');
  console.log('  - 1 usuario admin');
  console.log('  - 3 clientes');
  console.log('  - 3 proyectos');
  console.log('  - 5 tareas');
  console.log('  - 3 facturas (con items)');
  console.log('  - 2 contratos');
  console.log('\n🔐 Credenciales de acceso:');
  console.log('  Email: admin@demo.com');
  console.log('  Password: Demo123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });