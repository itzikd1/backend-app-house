// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.recipe.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.shoppingItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.family.deleteMany({});

  // Create a test family
  const family = await prisma.family.create({
    data: {
      name: 'Test Family',
    },
  });

  // Create two test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User 1',
        password: 'password123',
        role: 'USER',
        familyId: family.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'test2@test.com',
        name: 'Test User 2',
        password: 'password123',
        role: 'USER',
        familyId: family.id,
      },
    }),
  ]);

  // Helper function to create items for a user
  async function createUserItems(user) {
    // Notes
    for (let i = 1; i <= 4; i++) {
      await prisma.note.create({
        data: {
          title: `Note ${i} for ${user.email}`,
          content: `This is note ${i} for ${user.email}`,
          userId: user.id,
          familyId: family.id,
        },
      });
    }
    // Tasks
    for (let i = 1; i <= 4; i++) {
      await prisma.task.create({
        data: {
          title: `Task ${i} for ${user.email}`,
          description: `This is task ${i} for ${user.email}`,
          creatorId: user.id,
          familyId: family.id,
          priority: 'Medium',
        },
      });
    }
    // Shopping Items
    for (let i = 1; i <= 4; i++) {
      await prisma.shoppingItem.create({
        data: {
          name: `Shopping Item ${i} for ${user.email}`,
          quantity: i,
          creatorId: user.id,
          familyId: family.id,
        },
      });
    }
    // Recipes
    for (let i = 1; i <= 3; i++) {
      await prisma.recipe.create({
        data: {
          title: `Recipe ${i} for ${user.email}`,
          ingredients: [
            { name: 'Ingredient A', amount: '1 unit' },
            { name: 'Ingredient B', amount: '2 units' },
          ],
          instructions: [
            `Step 1 for recipe ${i}`,
            `Step 2 for recipe ${i}`,
          ],
          userId: user.id,
          familyId: family.id,
        },
      });
    }
  }

  // Create items for each user
  for (const user of users) {
    await createUserItems(user);
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
