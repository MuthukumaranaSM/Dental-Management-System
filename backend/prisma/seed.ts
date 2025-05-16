import { PrismaClient, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const roles = [
    {
      name: RoleType.MAIN_DOCTOR,
      description: 'Main doctor with administrative privileges',
    },
    {
      name: RoleType.DENTIST,
      description: 'Dentist with treatment privileges',
    },
    {
      name: RoleType.RECEPTIONIST,
      description: 'Receptionist with appointment management privileges',
    },
    {
      name: RoleType.CUSTOMER,
      description: 'Regular customer/patient',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Roles seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
