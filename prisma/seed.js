// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Clear existing data
  await prisma.item.deleteMany({});
  
  // Create some test items
  const items = [
    { name: 'First Item' },
    { name: 'Second Item' },
    { name: 'Third Item' },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: item,
    });
  }
  
  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
